import type { CSSProperties } from "react";
import { Box } from "@shared/ui";
import * as cls from "./HeroOrbit.module.scss";

interface HeroOrbitProps {
    identities: readonly string[];
}

const markerTracks = [
    { label: "AI", trackClass: cls.trackOuter, duration: "17s", delay: "-1s" },
    { label: "WEB", trackClass: cls.trackOuter, duration: "21s", delay: "-8s" },
    { label: "APP", trackClass: cls.trackMiddle, duration: "14s", delay: "-4s" },
    { label: "GROW", trackClass: cls.trackMiddle, duration: "19s", delay: "-12s" },
] as const;

export const HeroOrbit = ({ identities }: HeroOrbitProps) => (
    <Box className={cls.orbit} aria-hidden="true">
        <span className={cls.orbitCore}>
            {identities.map((identity, index) => (
                <span
                    className={cls.identity}
                    key={identity}
                    style={{ "--identity-index": index } as CSSProperties}
                >
                    {identity}
                </span>
            ))}
        </span>
        {markerTracks.map(({ label, trackClass, duration, delay }) => (
            <span
                className={`${cls.markerTrack} ${trackClass}`}
                key={label}
                style={{ "--orbit-duration": duration, "--orbit-delay": delay } as CSSProperties}
            >
                <i className={cls.marker}>{label}</i>
            </span>
        ))}
    </Box>
);
