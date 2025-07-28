# variables for modifying total volume and increments
from sys import argv
volume, labelInc, largeInc, smallInc = [int(i) for i in argv[1:]]

# header
header="""<?xml version='1.0' encoding='utf-8'?>
<!-- Generator: Adobe Illustrator 15.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>
<svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
	 width='800px' height='900px' viewBox='-300 -50 500 850' xml:space='preserve'>
"""
print header

# vertical lines (outside of the cylinder)
line1="""<line x1='0'  y1='0' x2='0' y2='700' style='stroke:#000000;' stroke-width='5'/>"""
line2="""<line x1='100'  y1='0' x2='100' y2='700' style='stroke:#000000;' stroke-width='5'/>"""
print line1
print line2

# horizontal lines that mark volumes
def drawTick(n):
	x1 = 15
	x2 = 55
	stroke = 1
	label = False
	if (n % largeInc == 0):
		x1 = 5
		x2 = 95
		stroke = 2
	if (n % labelInc == 0):
		x1 = 5
		x2 = 95
		stroke = 2
		label = True
	y1 = 700 - 600 * (1.0 * n / volume)
	y2 = y1
	line="""<line x1='%s'  y1='%s' x2='%s' y2='%s' style='stroke:#000000;' stroke-width='%s'/>"""
	print line % (x1,y1,x2,y2,stroke)
	if (label):
		text = """<text x='%s' y='%s' text-anchor='end' font-size='16' font-family='Helvetica'>%s</text>"""
		print text % (x2, y2 - 3, n)

for i in range(1, (volume / smallInc) + 1):
	drawTick(smallInc * i);

# footer
footer="</svg>"
print footer