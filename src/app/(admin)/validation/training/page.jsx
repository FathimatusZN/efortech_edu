import { Suspense } from "react";
import ValidationTrainingClient from "./ValidationTrainingClient";

export default function ValidationTrainingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ValidationTrainingClient />
        </Suspense>
    );
}
