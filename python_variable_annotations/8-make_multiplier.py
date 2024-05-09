#!/usr/bin/env python3
from typing import Callable

def make_multiplier(multiplier: float) -> Callable[[float], float]:
    """
    Function that takes a float multiplier as argument and returns a function that multiplies a float by the multiplier.
    """
    def multiply(num: float) -> float:
        return num * multiplier
    return multiply
