#!/usr/bin/env python3
from typing import List, Union


def sum_mixed_list(mxd_lst: List[Union[int, float]]) -> float:
    """
    Function that takes a list of integers and floats as argument and returns their sum as a float.
    """
    return sum(mxd_lst)