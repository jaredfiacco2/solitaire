import { useState, useEffect } from 'react';

interface ResponsiveInfo {
    isMobile: boolean;
    isTablet: boolean;
    isLandscape: boolean;
    isPortrait: boolean;
    screenWidth: number;
    screenHeight: number;
}

export function useResponsive(): ResponsiveInfo {
    const [info, setInfo] = useState<ResponsiveInfo>(() => ({
        isMobile: window.innerWidth < 768,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
        isLandscape: window.innerWidth > window.innerHeight,
        isPortrait: window.innerWidth <= window.innerHeight,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
    }));

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            setInfo({
                isMobile: width < 768,
                isTablet: width >= 768 && width < 1024,
                isLandscape: width > height,
                isPortrait: width <= height,
                screenWidth: width,
                screenHeight: height,
            });
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    return info;
}
