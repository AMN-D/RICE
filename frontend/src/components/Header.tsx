import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, LogOut, User as UserIcon, LogIn, Sun, Moon, Monitor, ArrowUp, ArrowDown } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { TypographyH1, TypographySmall, TypographyMuted } from '@/components/ui/typography';

export default function Header() {
  const { user, loading, login, logout } = useAuth();
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const sortBy = searchParams.get('sort') || 'popular';
  const sortOrder = searchParams.get('order') || 'desc';

  const handleSortChange = (newSort: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', newSort);
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const toggleSortOrder = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('order', sortOrder === 'asc' ? 'desc' : 'asc');
    newParams.delete('page');
    setSearchParams(newParams);
  };

  return (
    <>
      <header className="bg-background sticky top-0 z-50 w-full">
        <div className="container flex h-16 items-center justify-between gap-4 max-w-7xl mx-auto px-4">
          {/* Logo/Title */}
          <div
            className="flex items-center gap-2 cursor-pointer transition-all"
            onClick={() => navigate('/')}
          >
            <div className="hidden sm:block">
              <TypographyH1 className="text-3xl pacifico-regular tracking-normal text-left">Rice</TypographyH1>
            </div>
          </div>

          {/* Search Bar & Sort */}
          <div className="flex-1 flex items-center justify-center max-w-2xl gap-2">
            <SearchBar />
            <div className="flex items-center -space-x-px">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[130px] h-9 rounded-r-none border-r-0 focus:ring-0 focus:ring-offset-0 bg-background">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">
                    <TypographySmall>Popular</TypographySmall>
                  </SelectItem>
                  <SelectItem value="top_rated">
                    <TypographySmall>Top Rated</TypographySmall>
                  </SelectItem>
                  <SelectItem value="recent">
                    <TypographySmall>Recent</TypographySmall>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 rounded-l-none bg-background hover:bg-accent"
                onClick={toggleSortOrder}
                title={sortOrder === 'asc' ? 'Switch to Descending' : 'Switch to Ascending'}
              >
                {sortOrder === 'asc' ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <>
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
                        <TypographySmall>{user.username}</TypographySmall>
                        <TypographyMuted className="text-xs leading-none">
                          {user.email || 'Logged in user'}
                        </TypographyMuted>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => navigate('/create')} className="cursor-pointer">
                      <Plus className="mr-2 h-4 w-4" />
                      <TypographySmall>Create Rice</TypographySmall>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setShowProfileModal(true)} className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <TypographySmall>Edit Profile</TypographySmall>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="cursor-pointer">
                        <Sun className="mr-2 h-4 w-4 dark:hidden" />
                        <Moon className="mr-2 h-4 w-4 hidden dark:block" />
                        <TypographySmall>Theme</TypographySmall>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                            <Sun className="mr-2 h-4 w-4" />
                            <TypographySmall>Light</TypographySmall>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                            <Moon className="mr-2 h-4 w-4" />
                            <TypographySmall>Dark</TypographySmall>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                            <Monitor className="mr-2 h-4 w-4" />
                            <TypographySmall>System</TypographySmall>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <TypographySmall>Logout</TypographySmall>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button onClick={login} variant="default" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  <TypographySmall>Login</TypographySmall>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <TypographySmall className="sr-only">Toggle theme</TypographySmall>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                      <TypographySmall>Light</TypographySmall>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                      <TypographySmall>Dark</TypographySmall>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                      <TypographySmall>System</TypographySmall>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
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
