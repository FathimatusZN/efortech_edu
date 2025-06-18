"use client";
import { Suspense } from "react";
import SigninForm from "./SigninForm";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SigninForm />
        </Suspense>
    );
}
