import crypt
import sys


def ch_pass(passwd: str) -> str:
    if passwd is None:
        passwd = ""

    pass_bytes = passwd.encode("utf-8").replace(b" ", b"")

    if len(pass_bytes) < 2:
        pass_bytes += b"IlIl"

    def last_byte(b: bytes, n: int) -> int:
        idx = len(b) - n
        if idx < 0:
            idx = 0
        return b[idx]

    ta1 = last_byte(pass_bytes, 1)
    ta2 = last_byte(pass_bytes, 2)
    ta3 = last_byte(pass_bytes, 3)
    ta4 = last_byte(pass_bytes, 4)

    cryptword = bytes([ta1, ta2, ta3, ta4]).decode("latin-1")
    first_salt = bytes([ta2, ta3]).decode("latin-1")

    firstcrypt = crypt.crypt(cryptword, first_salt)

    fc = firstcrypt.encode("latin-1")
    second_salt = (fc[-1:] + fc[-2:-1]).decode("latin-1")

    return crypt.crypt(pass_bytes.decode("latin-1"), second_salt)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: python ch_pass.py <password>")
        sys.exit(1)

    print(ch_pass(sys.argv[1]))
