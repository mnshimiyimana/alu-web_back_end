#!/usr/bin/env python3
"""collect 10 numbers using an async"""

from typing import List

async_generator = __import__('0-async_generator').async_generator


async def async_comprehension() -> List[float]:
    """Return random numbers using an async generator"""
    return [i async for i in async_generator()]
