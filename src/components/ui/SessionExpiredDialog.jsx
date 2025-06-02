"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function SessionExpiredDialog() {
    const router = useRouter();
    const { sessionExpired, setSessionExpired } = useAuth();

    const handleSignIn = () => {
        setSessionExpired(false);
        router.push("/auth/signin");
    };

    const handleBackHome = () => {
        setSessionExpired(false);
        router.push("/home");
    };

    return (
        <Dialog open={sessionExpired} onOpenChange={setSessionExpired}>
            <DialogContent className="text-center max-w-[90vw] md:max-w-md lg:max-w-md sm:max-w-md rounded-md">
                <DialogHeader>
                    <DialogTitle>Session Expired</DialogTitle>
                    <DialogDescription>
                        Your sign-in session has expired. Please sign in again to continue using the website.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-center gap-2 mt-4">
                    <Button variant="outline" onClick={handleBackHome}>
                        Back to Home
                    </Button>
                    <Button className="bg-mainOrange text-white hover:bg-orange-600" onClick={handleSignIn}>
                        Sign In
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
