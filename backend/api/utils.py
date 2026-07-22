import random, string

class utils:
    def generate_token(length):
        letters_and_digits = string.ascii_letters + string.letters_and_digits
        return ''.join((random.choice(letters_and_digits) for i in range(length)))