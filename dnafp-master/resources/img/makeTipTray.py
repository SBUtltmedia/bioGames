print '''<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 19.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 154.4 106.3" style="enable-background:new 0 0 154.4 106.3;" xml:space="preserve">
<style type="text/css">
	.st0{fill:#4265B0;stroke:#000000;stroke-miterlimit:10;}
	.st1{fill:#B3B1A2;}
	.st2{fill:#D4D3CA;fill-opacity:0.8;enable-background:new    ;}
    .st3{fill:#5A585A;}
    .st4{opacity:0;}
</style>
<path class="st0" d="M142.4,105.1H12c-6.6,0-12-5.4-12-12V12C0,5.4,5.4,0,12,0h130.4c6.6,0,12,5.4,12,12v81.1
	C154.4,99.7,149,105.1,142.4,105.1z"/>
<title>Layer 1</title>
<g>
'''
spanWidth=12.1
spanHeight=12.1
padWidth=10
padHeight=10
for i in range(12):
    for j in range(8):
        posX= ((i*spanWidth)+padWidth)
        posY=((j*spanHeight)+padHeight)
        tipId="id='tip"+str(i)+"_"+str(j)+"'"
        print '''        <g class="tipTop" %s>

	       <g >
           <rect  class="st4" x="%f" y="%f" width="%f" height="%f" />
		  <ellipse class="st1"  cx="%f" cy="%f" rx="5.3" ry="5.3"/>
	       
	       <circle class="st2"  cx="%f" cy="%f"  r="4.1"/>
           </g>
        </g>
        ''' % (tipId,posX-spanWidth/2,posY-spanWidth/2,spanWidth,spanWidth,posX,posY,posX,posY)
print "</svg>"

