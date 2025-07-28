import math
import decimal
r = 50
smallTickSize = 2.5
smallTickStroke = .25
largeTickSize = smallTickSize * 2
largeTickStroke = smallTickStroke * 2.5
inc = 0
minWave = 340
maxWave = 950
textOffset = 1.25
header="""<?xml version='1.0' encoding='utf-8'?>
<!-- Generator: Adobe Illustrator 15.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>
<svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
	 width='300px' height='300px' viewBox='-150 -150 300 300' xml:space='preserve'>
"""
footer="</svg>"


def drawTick(i, r, l, stroke, text, rot):
	global inc
	theta=(i*3*(math.pi/2))
	x1= r*math.cos(theta)
	y1= -1*r*math.sin(theta)
	x2= (r-l)*math.cos(theta)
	y2= -1*(r-l)*math.sin(theta)
	line="""<line x1='%s'  y1='%s' x2='%s' y2='%s' style='stroke:#000000;' stroke-width='%s'/>"""
	line2="""<text x='%s' y='%s' transform='rotate(%s %s %s)' text-anchor="middle" font-size="4" font-family="Helvetica">%s</text>"""
	print line % (x1,y1,x2,y2,stroke)
	# line3 = """<circle cx='%s' cy='%s' r='.1' stroke='gray' stroke-width='1' fill='red' />"""
	# line4 = """<circle cx='%s' cy='%s' r='.1' stroke='red' stroke-width='1' fill='red' />"""
	if text != "":
		inc += 1
		x3 = x2+(x2-x1)
		y3 = y2+(y2-y1)
		offsetRot = math.radians(rot - 270)
		x4 = x3 + textOffset * math.cos(offsetRot)
		y4 = y3 + textOffset * math.sin(offsetRot)
		print line2 % (x4, y4, rot, x4, y4, text)
		# print line3 % (x3, y3)
		# print line4 % (x4, y4)
		# print line % (x3,y3,x4,y4,.2)
print header
numTicks = ((maxWave - minWave) / 5)
for i in range(numTicks+1):
	num = minWave + 5 * i
	text = ""
	tickSize = smallTickSize
	stroke = smallTickStroke
	if (num - minWave) % 10 == 0:
		stroke = largeTickStroke
		tickSize = largeTickSize
	if (num - minWave) % 20 == 0:
		text = num
	rot = 180 - i * (270.0/numTicks)
	drawTick(i/(numTicks+0.0), r, tickSize, stroke, text, rot)
	
print footer