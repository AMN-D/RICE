import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Eye,
    Star,
    Layers,
    MessageSquare,
    ImageIcon,
    User,
    Link as LinkIcon,
    MousePointerClick,
    Calendar,
    Clock
} from 'lucide-react';
import type { Rice } from '../types';

interface RiceCardProps {
    rice: Rice;
}

export function RiceCard({ rice }: RiceCardProps) {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <Card
            className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 border-muted/50 flex flex-col h-full"
            onClick={() => navigate(`/rice/${rice.id}`)}
        >
            <div className="aspect-video relative overflow-hidden bg-muted">
                {rice.preview_image ? (
                    <img
                        src={rice.preview_image}
                        alt={rice.name}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setIsLoaded(true)}
                        className={cn(
                            "w-full h-full object-cover transition-all duration-700 group-hover:scale-105",
                            isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-lg"
                        )}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground font-mono">
                        <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
                        <span className="text-[10px] uppercase tracking-widest">No preview image</span>
                    </div>
                )}
                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                    {rice.avg_rating !== null && (
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm gap-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            {rice.avg_rating.toFixed(1)}
                        </Badge>
                    )}
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm font-mono text-[10px]">
                        ID: {rice.id}
                    </Badge>
                </div>
            </div>

            <CardHeader className="p-4 pb-2">
                <h3 className="text-lg font-bold truncate group-hover:text-primary transition-colors">
                    {rice.name}
                </h3>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-4 flex-1">
                {/* Core Stats */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground border-b pb-3">
                    <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{rice.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{rice.themes_count} themes</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{rice.reviews_count} reviews</span>
                    </div>
                </div>

                {/* Technical / Raw Data */}
                <div className="grid grid-cols-1 gap-2 border-b pb-3">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <User className="w-3 h-3" /> USER_ID
                        </span>
                        <span>{rice.user_id}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <MousePointerClick className="w-3 h-3" /> CLICKS
                        </span>
                        <span>{rice.dotfile_clicks}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-mono w-full group/link overflow-hidden">
                        <LinkIcon className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span className="truncate text-blue-500 hover:underline">{rice.dotfile_url}</span>
                    </div>
                </div>

                {/* Timeline Metadata */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                        <Calendar className="w-3 h-3" />
                        <span>Added: {new Date(rice.date_added).toLocaleDateString()}</span>
                    </div>
                    {rice.date_updated && (
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                            <Clock className="w-3 h-3" />
                            <span>Updated: {new Date(rice.date_updated).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}


export function RiceCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="aspect-video">
                <div className="w-full h-full bg-muted animate-pulse" />
            </div>
            <CardHeader className="p-4 pb-2">
                <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex gap-4">
                    <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                </div>
            </CardContent>
        </Card>
    );
}
