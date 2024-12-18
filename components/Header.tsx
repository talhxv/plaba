'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

interface HeaderProps {
    setActiveTab: (tab: string) => void;
}

export function Header({ setActiveTab }: HeaderProps) {
    const { theme, toggleTheme } = useTheme()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" onClick={() => setActiveTab('input')} className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">PLABA ⚕️ </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <button
                            onClick={() => setActiveTab('input')}
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Home
                        </button>
                        <button
                            onClick={() => setActiveTab('examples')}
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Examples
                        </button>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Toggle Theme"
                        className="mr-6"
                        onClick={toggleTheme}
                    >
                        {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                    </Button>
                </div>
            </div>
        </header>
    )
}

