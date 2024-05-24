#!/usr/bin/env python3
""" Regex-ing"""

import re

def filter_datum(fields, redaction, message, separator):
    return separator.join([(field if field not in fields else redaction) for field in message.split(separator)])
