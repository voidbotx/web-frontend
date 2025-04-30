import React from 'react';

export default function Footer(): React.ReactElement {
    return (
        <footer className="bg-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} MemedIn. All rights reserved.
            </div>
        </footer>
    );
}