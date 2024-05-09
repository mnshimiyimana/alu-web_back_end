#!/usr/bin/env python3

def shout_hello(name: str, repeat: int = 1) -> str:
    """
    Function that takes a name (str) and an optional repeat (int) value,
    and returns a string that shouts "Hello <name>!" the specified number of times.
    """
    return ("Hello " + name + "! ") * repeat
