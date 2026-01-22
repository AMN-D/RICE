import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Star, Layers, MessageSquare, ImageIcon } from 'lucide-react';
import type { Rice } from '../types';

interface RiceCardProps {
    rice: Rice;
}

export function RiceCard({ rice }: RiceCardProps) {
    const navigate = useNavigate();

    return (
        <Card
            className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 border-muted/50"
            onClick={() => navigate(`/rice/${rice.id}`)}
        >
            <div className="aspect-video relative overflow-hidden bg-muted">
                {rice.preview_image ? (
                    <img
                        src={rice.preview_image}
                        alt={rice.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
                        <span className="text-sm font-medium">No preview image</span>
                    </div>
                )}
                {rice.avg_rating && (
                    <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm gap-1">
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            {rice.avg_rating.toFixed(1)}
                        </Badge>
                    </div>
                )}
            </div>

            <CardHeader className="p-4 pb-2">
                <h3 className="text-lg font-bold truncate group-hover:text-primary transition-colors">
                    {rice.name}
                </h3>
            </CardHeader>

            <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{rice.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Layers className="w-4 h-4" />
                        <span>{rice.themes_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{rice.reviews_count}</span>
                    </div>
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
