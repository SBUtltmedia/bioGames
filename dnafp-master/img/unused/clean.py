import os
with open('has.txt') as x: has = x.read().split("\n")
with open('compare.txt') as x: compare = x.read().split("\n")
for i in compare:
    if not i in has:
        if os.path.exists(i):
            os.remove(i)
        else:
            print(i)
