/**
 * frontend/src/lib/pose.ts
 * Client-side mirror of backend/pose.py.
 *
 * The replay canvas and the extractor must agree on what the pose block IS --
 * which landmarks exist, which edges are body geometry -- or the overlay will
 * draw a skeleton the model never saw. The two files are kept deliberately
 * small and parallel; the authoritative copy is the Python one, because that is
 * the side that writes the numbers.
 */

/** BlazePose landmark count. Each point is (x, y, z, visibility). */
export const POSE_POINTS = 33;

/**
 * Body skeleton edges. Fingertips and feet are omitted: the fingers belong to
 * the 2x21 hand block and the toes are invisible in a signing distance shot.
 */
export const POSE_BODY_PAIRS: [number, number][] = [
  [11, 12],                                    // shoulders
  [11, 13], [13, 15],                          // left arm
  [12, 14], [14, 16],                          // right arm
  [11, 23], [12, 24], [23, 24],                // torso
  [23, 25], [25, 27],                          // left leg
  [24, 26], [26, 28],                          // right leg
  [0, 9], [0, 10], [9, 10],                    // nose <-> mouth corners
  [2, 5], [7, 8],                              // eyes and mouth midline
];

/** Nose + mouth corners: the landmarks the NMM detector reads. */
export const POSE_FACE_MARKERS: number[] = [0, 9, 10];

/** A single pose landmark as delivered by /api/simulation/frames. */
export type PosePoint = [number, number, number, number];
