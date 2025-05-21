// Background particle effect using the tsParticles "links" preset
// Docs: https://github.com/tsparticles/react
// Preset: https://github.com/tsparticles/presets/tree/main/presets/links#readme

/* adust particles so there's less lol*/
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadLinksPreset } from "@tsparticles/preset-links";

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      await loadLinksPreset(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const options = useMemo(
    () => ({
      preset: "links",
      background: {
        color: {
          value: "#0d0d0d",
        },
      },
      particles: {
        color: {
          value: "var(--text)",
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "repulse", // particles move away from cursor
          },
        },
        modes: {
          repulse: {
            distance: 200,
            duration: 0.4,
            factor: 100,
            speed: 1,
          },
        },
      },
      detectRetina: true,
    }),
    []
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -999,
        }}
      />
    );
  }

  return <></>;
};

export default ParticlesBackground;
