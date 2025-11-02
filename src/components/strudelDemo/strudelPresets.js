export const strudelPresets = {
  basic: {
    name: "Basic Beat",
    description: "Simple drum pattern",
    code: `sound("bd sd, hh*4").speed(1)`,
    category: "drums"
  },

    melodic: {
        name: "Melodic Sequence",
        description: "Simple melody with bass",
        code: `stack(
    note("c3 e3 g3 c4").sound("sawtooth"),
    note("c2").sound("sawtooth").cutoff(500)
    )`,
        category: "melody"
    },
    
    complex: {
        name: "Complex Rhythm",
        description: "Polyrhythmic pattern",
        code: `stack(
    sound("bd*2, ~ sd").bank("RolandTR808"),
    sound("hh*8").gain(0.5),
    note("c2 [e2 g2] a2 [g2 f2]")
        .sound("sawtooth")
        .lpf(800)
    )`,
        category: "advanced"
    },
};

export const getPresetsArray = () => {
  return Object.entries(strudelPresets).map(([id, preset]) => ({
    id,
    ...preset
  }));
};