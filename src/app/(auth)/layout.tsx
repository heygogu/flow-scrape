import Logo from '@/components/Logo'
import React from 'react'

function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex flex-col items-center justify-center h-screen gap-4'>
            <Logo />
            {children}
        </div>
    )
}

export default AuthLayout