import math
import decimal
r= 100
smallTickSize=2.5
smallTickStroke=.25
largeTickSize=smallTickSize*2
largeTickStroke=smallTickStroke*2.5
numTicks=100
inc = 0
header="""<?xml version='1.0' encoding='utf-8'?>
<!-- Generator: Adobe Illustrator 15.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>
<svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
	 width='300px' height='300px' viewBox='-150 -150 300 300' xml:space='preserve'>
"""
footer="</svg>"

def drawTick(i, r, l, stroke, text, isAbove, rot):
	global inc
	theta=(3*math.pi/4)-(i*(math.pi/2))
	x1= r*math.cos(theta)
	y1= -1*r*math.sin(theta)
	x2= (r+l)*math.cos(theta)
	y2= -1*(r+l)*math.sin(theta)
	line="""<line x1='%s'  y1='%s' x2='%s' y2='%s' style='stroke:#000000;' stroke-width='%s'/>"""
	# line2="""<line x1='%s'  y1='%s' x2='%s' y2='%s' style='stroke:#000000;' stroke-width='%s' id='%s' transform='rotate(90 %s %s)'/>"""
	line2="""<text x='%s' y='%s' transform='rotate(%s %s %s)' text-anchor="middle" font-size="5" font-family="Helvetica">%s</text>"""
	print line % (x1,y1,x2,y2,stroke)
	if text != "":
		inc += 1
		# print line2 % (x2,y2,2*x2-x1,2*y2-y1,stroke,inc,x2+(x2-x1)/2.0,y2+(y2-y1)/2.0)
		if isAbove:
			print line2 % (x2+(x2-x1)/2.0, y2+(y2-y1)/2.0, rot, x2+(x2-x1)/2.0, y2+(y2-y1)/2.0, text)
		else:
			print line2 % (2*x2-x1, 2*y2-y1, rot, 2*x2-x1, 2*y2-y1, text)
		# line3="""<text font-family="Verdana" font-size="42.5"><textPath xlink:href="#%s">%s</textPath></text>"""
		# print line3 % (inc,text)

tickList = []
for i in range(50):
	tickList.append(round(i*.01, 2))
for i in range(10):
	tickList.append(round(.5 + i*.02, 2))
for i in range(6):
	tickList.append(round(.7 + i*.05, 2))
for i in range(6):
	tickList.append(round(1 + i*.1, 2))
tickList.append(2)
tickList.append(1000000)

longTicks = [.05, .15, .25, .35, .45, 1.5, 2, 1000000]
for i in range(11):
	longTicks.append(round(.1*i,2))

# print tickList
# print longTicks
# quit()

print header
for i in range(numTicks+1):
	text = ""
	tickSize = smallTickSize
	stroke = smallTickStroke
	if i % 10 == 0:
		stroke = largeTickStroke
		text = i
	if i % 5 == 0:
		tickSize = largeTickSize
	rot = 0.9*i - 45
	drawTick(i/(numTicks+0.0), r, tickSize, stroke, text, True, rot)
	
for i in range(len(tickList)):
	text = ""
	stroke = smallTickStroke
	a = tickList[i]
	t = math.pow(10.0, 2-a) / 100
	tickSize = smallTickSize
	if a in longTicks:
		tickSize = largeTickSize
		stroke = largeTickStroke
		text = str(a)
		if (a == 1 or text == 2):
			text = text[0]
		if (a < 1):
			text = text
			text = text[1:]
		if (a == 0):
			text = text
			text = "0"
	rot = 90.0 * t - 45
	# rot = 0
	drawTick(t, .9*r, -1*tickSize, stroke, text, False, rot)

print footer