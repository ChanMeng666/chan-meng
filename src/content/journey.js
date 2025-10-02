/**
 * The Journey - Chan Meng's Life Story
 *
 * Chronicles Chan's path from family constraints to minimalist freedom,
 * from Guilin to Nanning to New Zealand.
 */

export const journeyModule = {
  id: 'journey',
  title: 'The Journey',
  description: "Chan's path from family constraints to minimalist freedom",
  estimatedTime: 420, // 7 minutes
  icon: '🗺️ ',
  order: 1,
  segments: [
    {
      id: 1,
      moduleId: 'journey',
      title: 'Constrained Beginnings',
      content: `Chan grew up in a household filled with tension. Her parents' marriage was crumbling—her father's affair, her mother's dependency, the constant conflict. As a high school student, she watched her mother sink into despair, using her as an emotional dumping ground.

Every weekend home from boarding school, Chan became a reluctant therapist. Her mother complained endlessly: about grandmother, about being a "widow" to her parenting duties, about her husband's coldness. The apartment was cluttered with things her mother couldn't let go of—old furniture, decorative items, memories of a marriage that was already dead.

When the divorce finally came during Chan's senior year, it felt both inevitable and traumatic. Her father wanted his unborn son; her mother got nearly nothing in the settlement. Chan learned early that holding on too tightly only brings pain.`,
      estimatedTime: 90,
      type: 'narrative',
      metadata: {
        year: 2010,
        location: 'Nanning & Guilin, China',
        theme: ['family', 'independence'],
        quote: 'I saw my mother at her most vulnerable, and I promised myself: never like that.'
      }
    },
    {
      id: 2,
      moduleId: 'journey',
      title: 'The Breaking Point (2018)',
      content: `At 28 years old in 2018, Chan was living with her mother in Guilin, working at a training center, trying to save money by avoiding rent. But the cost wasn't just financial—it was her dignity.

After a year-long relationship fell apart (another casualty of her mother's matchmaking pressure), Chan's mother said the words that would change everything:

"你卖都卖不出去" (You can't even sell yourself).

The cruelty of that statement—reducing her to a commodity, to a failure in the marriage market—crystallized everything Chan needed to escape. She'd already been exploring extreme budgeting and minimalism online. Now she had her motivation.

Within a week, she found an empty apartment in Nanning. Not just sparse—completely empty. No bed, no furniture, nothing. The landlord had meant it as an office space. Chan saw it as freedom.`,
      estimatedTime: 90,
      type: 'narrative',
      metadata: {
        year: 2018,
        location: 'Guilin, China',
        theme: ['family-separation', 'independence', 'minimalism'],
        quote: '"你卖都卖不出去" - These words freed me.'
      }
    },
    {
      id: 3,
      moduleId: 'journey',
      title: 'The Empty Room (2020-2023)',
      content: `Moving into that empty 20-square-meter room in Nanning was like pressing reset on life. No bed frame, no closet, no kitchen table. Just space, light, and possibility.

Chan bought a foam mat for 80 RMB ($12). It served as her bed, and when it sagged after six months, she'd cut it in half and flip the worn parts to the edges. One foam mat could last a year this way.

During the day, sunlight would sweep across the room. Chan would move her foam mat to follow it, like a plant tracking the sun. At night, if there was a full moon, she'd position herself in the moonlight. No furniture to block her; no possessions to manage. Just her and the cosmos.

Her belongings fit in three shopping bags: clothes in one, hygiene products in another, cooking pot and miscellaneous in the third. She could pack up and leave in five minutes. She practiced this sometimes, timing herself, feeling the freedom of ultimate mobility.

The landlord visited once to fix a pipe, stunned by the emptiness. "Your room is so... empty," she said, with what Chan detected as approval. Good tenants don't damage property; the best tenants barely leave a trace.`,
      estimatedTime: 120,
      type: 'narrative',
      metadata: {
        year: 2020,
        location: 'Nanning, China',
        theme: ['physical-minimalism', 'independence'],
        asciiArt: `
    ╔══════════════════════╗
    ║                      ║
    ║    [foam mat]        ║
    ║                      ║
    ║         ☀️            ║
    ║                      ║
    ╚══════════════════════╝
       "Following the sun"`
      }
    },
    {
      id: 4,
      moduleId: 'journey',
      title: 'New Horizons (2023-Present)',
      content: `In 2023, Chan made a decision that would have seemed impossible to her younger self: she would study abroad in New Zealand.

It required leaving behind even the foam mat, the empty room, the routine she'd perfected. But minimalism had taught her that nothing—not even minimalism itself—should be held too tightly.

The move was characteristically simple: one backpack, one small suitcase. Everything else was gifted to the recycling lady in her building, a woman who'd watched Chan's minimalism with curious approval over the years.

New Zealand brought new challenges. Colder weather meant more clothes (though Chan kept them to just 3-4 outfits). Shared housing meant she couldn't have her empty room. Student life meant new obligations and schedules.

But the core lesson remained: value the present moment. Don't accumulate for an uncertain future. Travel light. Move freely. And when something—or someone—no longer serves the current moment, let it go.

Chan's minimalism had evolved from desperate escape to deliberate practice to existential philosophy. In New Zealand, far from family pressure and cultural expectations, she could finally ask: What do I actually want? And the answer, more often than not, was: Less.`,
      estimatedTime: 120,
      type: 'narrative',
      metadata: {
        year: 2023,
        location: 'New Zealand',
        theme: ['independence', 'present-moment', 'minimalism']
      }
    }
  ]
};
