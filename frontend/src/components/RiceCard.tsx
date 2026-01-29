import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, ImageIcon, Calendar, Clock } from 'lucide-react';
import type { RiceCard as RiceCardType } from '../types';
import { TypographySmall, TypographyMuted, TypographyLarge } from '@/components/ui/typography';

interface RiceCardProps {
    rice: RiceCardType;
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
                        <TypographyMuted className="text-[10px] uppercase tracking-widest">No preview image</TypographyMuted>
                    </div>
                )}
                {rice.avg_rating !== null && (
                    <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm gap-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            {rice.avg_rating.toFixed(1)}
                        </Badge>
                    </div>
                )}
            </div>

            <CardHeader className="p-4 pb-2">
                <TypographyLarge className="truncate group-hover:text-primary transition-colors">
                    {rice.name}
                </TypographyLarge>
                {rice.poster_name && (
                    <TypographyMuted className="text-xs">by {rice.poster_name}</TypographyMuted>
                )}
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-3 flex-1">
                {/* Stats */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <TypographySmall className="font-medium">Views:</TypographySmall>
                        <TypographySmall>{rice.views}</TypographySmall>
                    </div>
                    <div className="flex items-center gap-1">
                        <TypographySmall className="font-medium">Themes:</TypographySmall>
                        <TypographySmall>{rice.themes_count}</TypographySmall>
                    </div>
                    <div className="flex items-center gap-1">
                        <TypographySmall className="font-medium">Reviews:</TypographySmall>
                        <TypographySmall>{rice.reviews_count}</TypographySmall>
                    </div>
                </div>

                <Separator />

                {/* Dates */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <TypographySmall className="font-medium text-[10px]">Created:</TypographySmall>
                        <TypographySmall className="text-[10px]">{new Date(rice.date_added).toLocaleDateString()}</TypographySmall>
                    </div>
                    {rice.date_updated && (
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <TypographySmall className="font-medium text-[10px]">Updated:</TypographySmall>
                            <TypographySmall className="text-[10px]">{new Date(rice.date_updated).toLocaleDateString()}</TypographySmall>
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
                <div className="h-4 w-1/3 bg-muted animate-pulse rounded mt-1" />
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

