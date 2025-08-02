// src/components/header.tsx
"use client";

import { useState } from 'react';
import Link from "next/link";
import { AppLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { LayoutGrid, User } from "lucide-react";
import { useUser } from "@/hooks/use-user";

// Import Dialog components
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const { user, age: userAge, location: userLocation, setUserAge, setUserLocation } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [age, setAge] = useState<string>(userAge ? userAge.toString() : '');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [showManualLocation, setShowManualLocation] = useState(false); // State to show manual location input
  const [manualLocation, setManualLocation] = useState<string>(''); // State for manual location input

  const { toast } = useToast();

  const handleSaveAge = () => {
    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber) || ageNumber <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Age",
        description: "Please enter a valid age.",
      });
      return;
    }

    setUserAge(ageNumber);
    // Do not close dialog here, allow user to enter location or request it
    toast({
      title: "Age Saved",
      description: "Your age has been saved.",
    });
  };

  const handleRequestLocation = () => {
    setIsFetchingLocation(true);
    setShowManualLocation(false); // Hide manual input when requesting geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location fetched:", position.coords);
          setUserLocation({ 
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setIsFetchingLocation(false);
          setIsDialogOpen(false); // Close on successful fetch
           toast({
            title: "Location Saved",
            description: "Your location has been saved.",
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
          setIsFetchingLocation(false);
          setShowManualLocation(true); // Show manual input on error
          let errorMessage = "Could not fetch location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied. Please enable it in your browser settings or enter manually.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable. Please enter manually.";
              break;
            case error.TIMEOUT:
              errorMessage = "The request to get user location timed out. Please enter manually.";
              break;
          }
           toast({
            variant: "destructive",
            title: "Location Error",
            description: errorMessage,
          });
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setIsFetchingLocation(false);
      setShowManualLocation(true); // Show manual input if geolocation not supported
       toast({
        variant: "destructive",
        title: "Location Error",
        description: "Geolocation is not supported by your browser. Please enter manually.",
      });
    }
  };

  const handleSaveLocation = () => {
    // You would typically need to geocode the manual location string here
    // For this example, we'll just save the string or a dummy coordinate
    console.log("Saving manual location:", manualLocation);
    // In a real app, call a geocoding service to get lat/lon from manualLocation
    // For now, saving a dummy location or the string itself (depending on how you use it later)
    setUserLocation({ latitude: 0, longitude: 0 }); // Saving dummy coordinates for now
    // Or save the string: setUserLocation({ latitude: 0, longitude: 0, manual: manualLocation }); 
    setIsDialogOpen(false); // Close the dialog
    toast({
      title: "Location Saved",
      description: "Your manually entered location has been saved.",
    });
  };

  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-white/10 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-4">
        <AppLogo className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-foreground tracking-tight">
          StreamWeaver
        </h1>
      </Link>
      <nav className="flex items-center gap-2">
        {/* Removed Dashboard Link */}
        {/* Removed Admin Link */}
        {/*
         <Button asChild variant="ghost">
          <Link href="/admin">
            <ShieldCheck />
            Admin
          </Link>
        </Button>
        */}

        {/* User Profile Dialog Trigger */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" aria-label="User Profile">
              <User />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
              <DialogDescription>
                Provide your age and location to personalize your recommendations.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                 <Label htmlFor="age">Age</Label>
                 <Input
                   id="age"
                   type="number"
                   value={age}
                   onChange={(e) => setAge(e.target.value)}
                 />
              </div>

              <div className="space-y-2">
                 <Label htmlFor="location">Location</Label>
                 {!showManualLocation ? (
                   <Button onClick={handleRequestLocation} disabled={isFetchingLocation} className="w-full">
                     {isFetchingLocation ? 'Fetching Location...' : 'Request Location'}
                    </Button>
                 ) : (
                    <Input
                      id="location"
                      type="text"
                      placeholder="Enter your city or region"
                      value={manualLocation}
                      onChange={(e) => setManualLocation(e.target.value)}
                    />
                 )}
              </div>
               {showManualLocation && ( 
                <Button onClick={handleSaveLocation} disabled={manualLocation.trim() === ''}>Save Location</Button>
               )}
            </div>
            <DialogFooter>
              {/* Buttons are now within the main content area or specific to location */}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </nav>
    </header>
  );
}
