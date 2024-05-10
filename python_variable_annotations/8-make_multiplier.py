#!/usr/bin/env python3
"""Complex types - functions"""

from typing import Callable


def make_multiplier(multiplier: float) -> Callable[[float], float]:
    """takes a float multiplier as argument and returns a function that multiplies a float by the multiplier."""
    def multiply(num: float) -> float:
        return num * multiplier
    return multiply
