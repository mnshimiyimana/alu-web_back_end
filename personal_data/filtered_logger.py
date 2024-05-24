#!/usr/bin/env python3
""" Regex-ing"""

import re

def filter_datum(fields, redaction, message, separator):
    pattern = f'({"|".join(fields)})=[^{separator}]*'
    matches = re.findall(pattern, message)
    for match in matches:
        message = message.replace(match, f'{match.split("=")[0]}={redaction}')
    return message