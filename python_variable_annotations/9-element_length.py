#!/usr/bin/env python3
"""Write a type-annotated function element_length."""

from typing import List, Tuple, Sequence, Iterable


def element_length(lst: Iterable[Sequence]) -> List[Tuple[Sequence, int]]:
    """Return a list of tuples of the form (element, length)."""
    return [(i, len(i)) for i in lst]
