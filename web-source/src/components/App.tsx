import { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Pause } from "lucide-react";
import { ISlideshow, ISong } from "@/types";
import { useNuiEvent } from "@/hooks/useNuiEvent";
import { useVisibility } from "../store/visibility";
import { useShallow } from 'zustand/react/shallow';

const App: React.FC = () => {
    const [visible, setVisible] = useVisibility(useShallow((state) => [state.visible, state.setVisible]))
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [slideshowImages, setSlideshowImages] = useState<ISlideshow[]>([]);
    const [songsConfig, setSongsConfig] = useState<ISong[]>([]);

    useNuiEvent("TOGGLE", (data) => {
        setVisible(data); 
    });

    useEffect(() => {
        fetch('./config/images.json')
            .then((response) => response.json())
            .then((data) => {
                setSlideshowImages(data);
            })
            .catch((error) => {
                console.error('could not load images: ', error);
            });
    }, []);

    useEffect(() => {
        fetch('./config/songs.json')
            .then((response) => response.json())
            .then((data) => {
                setSongsConfig(data);
            })
            .catch((error) => {
                console.error('could not load songs: ', error);
            });
    }, []);

    useEffect(() => {
        var count = 0;
        var thisCount = 0;
        const eventListener = (event: any) => {
            const { eventName } = event.data;

            if (eventName == 'startInitFunctionOrder') {
                count = event.data.count;
                setProgress(count);
            } else if (eventName == 'initFunctionInvoking') {
                let idx = event.data.idx;
                setProgress(((idx / count) * 100));
            } else if (eventName == 'startDataFileEntries') {
                count = event.data.count;
                setProgress(count);
            } else if (eventName == 'performMapLoadFunction') {
                ++thisCount;
                setProgress((thisCount / count) * 100);
            }
        };    

        window.addEventListener("message", eventListener);
        return () => window.removeEventListener("message", eventListener);
    }, [progress]);

    useEffect(() => {
        if (slideshowImages.length === 0) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % slideshowImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slideshowImages.length]);

    useEffect(() => {
        console.log("Slideshow Images: ", (currentImageIndex + 1) % slideshowImages.length);
        console.log("Current Image Index: ", currentImageIndex);
        console.log("Current Song Index: ", currentSongIndex);
    }, [currentImageIndex, currentSongIndex]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const nextSong = () => {
        setCurrentSongIndex((prev) => (prev + 1) % songsConfig.length);
    };

    const previousSong = () => {
        setCurrentSongIndex((prev) => (prev - 1 + songsConfig.length) % songsConfig.length);
    };

    if (!visible) return null;

    return (
        <div className="min-h-screen bg-black">
            {/* Image Slideshow & Other Stuff */}
            <div
                className="relative h-screen w-full overflow-hidden"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${slideshowImages[currentImageIndex]?.url}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Center Logo */}
                <img className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" src="./config/logo.png" alt="Logo"/>

                {/* Music Player Controls */}
                <div className="absolute left-6 bottom-24 z-10">
                    <Card className="w-[300px] bg-black/60 backdrop-blur-md border-gray-800">
                        <div className="p-4 flex items-center gap-4">
                            <div className="relative w-12 h-12 bg-gray-800 rounded-md overflow-hidden">
                                <Skeleton className="h-full w-full" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">{songsConfig[currentSongIndex]?.title}</p>
                                <p className="text-xs text-gray-400">{songsConfig[currentSongIndex]?.artist}</p>
                            </div>
                            <button
                                onClick={togglePlay}
                                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                            >
                                {isPlaying ? (
                                    <Pause className="h-4 w-4 text-white" />
                                ) : (
                                    <Play className="h-4 w-4 text-white" />
                                )}
                            </button>
                        </div>
                        <div className="p-4 flex justify-between items-center text-gray-400 text-sm">
                            <button
                                onClick={previousSong}
                                className="hover:text-white transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={nextSong}
                                className="hover:text-white transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Music Player */}
                <div className="absolute bottom-6 left-6 right-6">
                    <ReactPlayer
                        url={songsConfig[currentSongIndex]?.file}
                        playing={isPlaying}
                        controls={true}
                        width="0px" 
                        volume={0.02}
                        height="0px"
                        config={{
                            youtube: {
                                playerVars: { modestbranding: 1, controls: 1, showinfo: 0 },
                            },
                        }}
                    />
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="space-y-2">
                        <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white transition-all duration-300 ease-in-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-400 uppercase tracking-wider">
                            Loading, Please Wait...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
