#!/usr/bin/env python3
"""concurent coroutines"""

import asyncio
from typing import List


task_wait_random = __import__('3-tasks').task_wait_random


async def task_wait_n(n: int, max_delay: int) -> List[float]:
    """alter wait_n into a new function task_wait_n"""
    tasks = [task_wait_random((max_delay)) for i in range(n)]
    return [await task for task in asyncio.as_completed(tasks)]