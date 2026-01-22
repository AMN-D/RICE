import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ProfileModal from './ProfileModal';
import SearchBar from './SearchBar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, LogOut, User as UserIcon, Layout, LogIn } from 'lucide-react';
import { ModeToggle } from './mode-toggle';

export default function Header() {
  const { user, loading, login, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
        <div className="container flex h-16 items-center justify-between gap-4 max-w-7xl mx-auto px-4">
          {/* Logo/Title */}
          <div
            className="flex items-center gap-2 cursor-pointer group transition-all"
            onClick={() => navigate('/')}
          >
            <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
              <Layout className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight">Rice Showcase</h1>
              <p className="text-xs text-muted-foreground -mt-1">Linux customizations</p>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <>
                <Button
                  onClick={() => navigate('/create')}
                  size="sm"
                  className="hidden md:flex gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Rice
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden ring-offset-background transition-colors hover:ring-2 hover:ring-ring hover:ring-offset-2">
                      <Avatar>
                        <AvatarImage src={user.avatar_url || ''} alt={user.username || 'User'} />
                        <AvatarFallback>{user.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email || 'Logged in user'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowProfileModal(true)} className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Edit Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/create')} className="md:hidden cursor-pointer">
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Create Rice</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={login} variant="default" className="gap-2">
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            )}
            <ModeToggle />
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
}
