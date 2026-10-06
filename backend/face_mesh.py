"""Extract dense MediaPipe Face Mesh points from sign reference videos."""

from pathlib import Path
from threading import Lock

import cv2
import mediapipe as mp

_mesh = None
_lock = Lock()
_cache: dict[tuple[str, int, int, int], list[list[list[float]]]] = {}
_connections = sorted(mp.solutions.face_mesh.FACEMESH_TESSELATION)


def extract_video_face_mesh(
    video_path: Path,
    frame_count: int,
) -> tuple[list[list[list[float]]], list[tuple[int, int]]]:
    """Sample a source video to match a replay and return its normalized face mesh."""
    global _mesh

    if frame_count < 1:
        raise ValueError("frame_count must be positive")
    if not video_path.is_file():
        raise FileNotFoundError(f"Face Mesh source video not found: {video_path.name}")

    resolved_path = video_path.resolve()
    cache_key = (
        str(resolved_path),
        video_path.stat().st_mtime_ns,
        frame_count,
        len(_connections),
    )

    with _lock:
        cached = _cache.get(cache_key)
        if cached is not None:
            return cached, _connections

        capture = cv2.VideoCapture(str(resolved_path))
        if not capture.isOpened():
            capture.release()
            raise ValueError(f"Could not open Face Mesh source video: {video_path.name}")

        try:
            total_frames = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
            if total_frames < 1:
                raise ValueError(f"Source video has no readable frames: {video_path.name}")

            sample_indices: dict[int, list[int]] = {}
            for index in range(frame_count):
                frame_position = round(
                    index * (total_frames - 1) / max(frame_count - 1, 1)
                )
                sample_indices.setdefault(frame_position, []).append(index)
            sampled: list[list[list[float]]] = [[] for _ in range(frame_count)]

            if _mesh is None:
                _mesh = mp.solutions.face_mesh.FaceMesh(
                    static_image_mode=False,
                    max_num_faces=1,
                    refine_landmarks=True,
                    min_detection_confidence=0.5,
                    min_tracking_confidence=0.5,
                )

            frame_index = 0
            while frame_index < total_frames:
                ok, frame = capture.read()
                if not ok:
                    break

                result = _mesh.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
                output_indices = sample_indices.get(frame_index, [])
                if output_indices and result.multi_face_landmarks:
                    points = [
                        [float(point.x), float(point.y)]
                        for point in result.multi_face_landmarks[0].landmark
                    ]
                    for output_index in output_indices:
                        sampled[output_index] = points
                frame_index += 1
        finally:
            capture.release()

        if frame_index < total_frames:
            raise ValueError(
                f"Could not decode all frames from Face Mesh source: {video_path.name}"
            )

        _cache[cache_key] = sampled
        if len(_cache) > 8:
            _cache.pop(next(iter(_cache)))
        return sampled, _connections
