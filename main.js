// ============= Build and render patch =============

d3.select('#loader-wrapper').style('opacity', '0');

Rpd.allNodeTypes['util/knob'].inlets['max'].default = 1;
var patch = Rpd.addPatch('jetbrains-art');

patch.render('svg', document.getElementById('patch-target'),
                { style: 'ableton-out',
                fullPage: true,
                linkForm: 'curve',
                inletAcceptsMultipleLinks: true });

var bangX = 40;
var bangY = 140;

var topMargin = window.innerHeight - 500;
var leftMargin = window.innerWidth/2 - 700;

var scaleAt = 1200;

if (window.innerWidth < scaleAt) {
    d3.select('.rpd-patch').style('transform', 'scale(0.8, 0.8)');
    d3.select('.rpd-patch .rpd-background').classed('hidden', true);
    leftMargin = window.innerWidth/2 - 500;
}

patch.addNode('jb/clear').move(leftMargin + 1061,topMargin + 112);

patch.addNode('util/nodelist').move(leftMargin + 1210,topMargin + 171);

var layersNode = patch.addNode('jb/layers').move(leftMargin + 1058,topMargin + 174);

var commentRemoved = false;

var commentNode = patch.addNode('util/comment').move(window.innerWidth/2 - 50, -60);
commentNode.inlets['text'].receive('Press SPACE to toggle the UI');

var previewTarget = document.getElementById('rpd-jb-preview-target');
previewTarget.style.width = window.innerWidth + 'px';
previewTarget.style.height = window.innerHeight + 'px';

Kefir.fromEvents(document.body, 'keydown').filter(function(evt) {
    return evt.keyCode === 32;
}).onValue(function(evt) {
    evt.preventDefault();
});

var overlayElm = document.getElementById('overlay');
overlayElm.style.width = window.innerWidth + 'px';
overlayElm.style.height = window.innerHeight + 'px';
var patchElm = document.getElementById('patch-target');
Kefir.fromEvents(document.body, 'keydown').filter(function(evt) {
    return evt.keyCode === 32;
}).scan(function(prev, next) {
    return !prev;
}, true).onValue(function(value) {
    overlayElm.className = value ? 'visible' : 'hidden';
    patchElm.className = value ? 'visible' : 'hidden';
    if (!value && !commentRemoved) {
        patch.removeNode(commentNode);
        commentRemoved = true;
    }
});



var previewNode = patch.addNode('jb/preview').move(leftMargin + 1210, topMargin + 89);
var saveNode = patch.addNode('jb/save').move(leftMargin + 1203, topMargin - 6);

var bangNode = patch.addNode('util/bang', 'Bang!').move(bangX, bangY);
var bang2Node = patch.addNode('util/bang', 'Bong!').move(bangX + 100, bangY);

var paletteNode = patch.addNode('jb/palette').move(bangX, bangY - 100);
var drawLogoNode = patch.addNode('jb/draw-logo').move(leftMargin + 944, topMargin + 376);
var rorschachNode = patch.addNode('jb/rorschach').move(leftMargin + 252, topMargin + 330);
var rorschachVerticalNode = patch.addNode('jb/rorschach-vertical').move(leftMargin + 253, topMargin + 395);

var noiseNode = patch.addNode('jb/noise').move(leftMargin + 127, topMargin + 258);
var backgroundNode = patch.addNode('jb/background').move(leftMargin + 130, topMargin + 40);

var octaveNoiseNode = patch.addNode('util/dial', 'Octaves').move(leftMargin + 29, topMargin + 310);
octaveNoiseNode.inlets['max'].receive(10);
octaveNoiseNode.configure({ dial: 4/10 });


var contrast = patch.addNode('util/knob', 'Contrast').move(leftMargin + 385,topMargin + 395);


var falloffNoiseNode = patch.addNode('util/knob', 'Falloff').move(leftMargin + 33, topMargin + 408);
falloffNoiseNode.inlets['max'].receive(1);


var noiseStep = patch.addNode('util/dial', 'Grain').move(leftMargin + 31, topMargin + 214);
noiseStep.inlets['max'].receive(100);
noiseStep.inlets['min'].receive(1);
noiseStep.configure({ dial: (10 - 1) / (100 - 1) });

var collectorStep = patch.addNode('util/dial', 'Step').move(leftMargin + 260, topMargin + 100);
collectorStep.inlets['max'].receive(40);
collectorStep.inlets['min'].receive(7);
collectorStep.configure({ dial: (16 - 7) / (40 - 7) });



var chaos = patch.addNode('util/dial', 'Chaos').move(leftMargin + 260, topMargin + 10);
chaos.configure({ dial: 50/100 });

// var threeColorsNode = patch.addNode('jb/three-colors', '3 Colors').move(leftMargin + 1249, bangY - 100);

var collectPointDataNode = patch.addNode('jb/collect-point-data').move(leftMargin + 370,topMargin + 125);

var drawPixelsNode = patch.addNode('jb/draw-pixels').move(leftMargin + 483, topMargin + 295);
var applyGradientNode = patch.addNode('jb/apply-gradient').move(leftMargin + 749, topMargin + 433);
var voronoiNode = patch.addNode('jb/voronoi').move(leftMargin + 496, topMargin + 127);
var edgesSquaresNode = patch.addNode('jb/edges-squares').move(leftMargin + 625, topMargin + 185);
var curvedEdgesNode = patch.addNode('jb/curved-edges').move(leftMargin + 891, topMargin + 114);
var backEdgesSquaresNode = patch.addNode('jb/back-edges-squares').move(leftMargin + 783, topMargin + 286);
var shapesNode = patch.addNode('jb/shapes').move(leftMargin + 779, topMargin + 131);
var vignetteNode = patch.addNode('jb/vignette').move(leftMargin + 571, topMargin + 365);

backgroundNode.outlets['pixels'].connect(collectPointDataNode.inlets['pixels']);

// rorschachVerticalNode.outlets['pixels'].connect(collectPointDataNode.inlets['pixels']);
backgroundNode.outlets['pixels'].connect(drawPixelsNode.inlets['pixels']);

paletteNode.outlets['palette'].connect(applyGradientNode.inlets['palette']);
//  paletteNode.outlets['palette'].connect(vignetteNode.inlets['palette']);
paletteNode.outlets['product'].connect(drawLogoNode.inlets['product']);
// paletteNode.outlets['palette'].connect(edgesSquaresNode.inlets['palette']);

octaveNoiseNode.outlets['number'].connect(noiseNode.inlets['octave']);
falloffNoiseNode.outlets['number'].connect(noiseNode.inlets['falloff']);
noiseStep.outlets['number'].connect(noiseNode.inlets['grain']);
collectorStep.outlets['number'].connect(collectPointDataNode.inlets['step']);
chaos.outlets['number'].connect(collectPointDataNode.inlets['chaos']);
contrast.outlets['number'].connect(drawPixelsNode.inlets['contrast']);

voronoiNode.outlets['voronoi'].connect(edgesSquaresNode.inlets['voronoi']);
rorschachNode.outlets['pixels'].connect(edgesSquaresNode.inlets['pixels']);
voronoiNode.outlets['voronoi'].connect(curvedEdgesNode.inlets['voronoi']);
voronoiNode.outlets['voronoi'].connect(shapesNode.inlets['voronoi']);
//paletteNode.outlets['product'].connect(backgroundNode.inlets['product']);

collectPointDataNode.outlets['points'].connect(voronoiNode.inlets['points']);
collectPointDataNode.outlets['points'].connect(backEdgesSquaresNode.inlets['points']);
rorschachNode.outlets['pixels'].connect(collectPointDataNode.inlets['pixels']);
paletteNode.outlets['product'].connect(backgroundNode.inlets['product']);

bangNode.outlets['bang'].connect(noiseNode.inlets['bang']);
bang2Node.outlets['bang'].connect(backgroundNode.inlets['bang']);
//
noiseNode.outlets['pixels'].connect(rorschachNode.inlets['pixels']);
// noiseNode.outlets['pixels'].connect(rorschachVerticalNode.inlets['pixels']);
rorschachNode.outlets['pixels'].connect(drawPixelsNode.inlets['pixels']);
//  rorschachVerticalNode.outlets['pixels'].connect(drawPixelsNode.inlets['pixels']);

drawPixelsNode.outlets['drawable'].connect(layersNode.inlets['layer-1']);
applyGradientNode.outlets['drawable'].connect(layersNode.inlets['layer-2']);
curvedEdgesNode.outlets['drawable'].connect(layersNode.inlets['layer-3']);
shapesNode.outlets['drawable'].connect(layersNode.inlets['layer-4']);
edgesSquaresNode.outlets['drawable'].connect(layersNode.inlets['layer-5']);
backEdgesSquaresNode.outlets['drawable'].connect(layersNode.inlets['layer-6']);
vignetteNode.outlets['drawable'].connect(layersNode.inlets['layer-7']);
drawLogoNode.outlets['drawable'].connect(layersNode.inlets['layer-8']);

layersNode.outlets['layers'].connect(previewNode.inlets['layers']);

previewNode.outlets['image'].connect(saveNode.inlets['image']);

//randomNode.inlets['min'].receive(12);
//randomNode.inlets['max'].receive(40);

//  randomNode.outlets['random'].connect(configNode.inlets['step']);

//setTimeout(function() {
    //   metroNode.outlets['bang'].connect(randomNode.inlets['bang']);
//}, 2000);

if (window.innerWidth < scaleAt) {
    d3.select('.rpd-nodelist-list').style('transform', 'scale(0.8, 0.8) translate(-15px, -125px)');
}

var dropAllowedClass = 'rpd-jb-drop-allowed';

function dropAllowedOn(elm) {
    return elm && elm.className && elm.className.indexOf && (elm.className.indexOf(dropAllowedClass) >= 0);
}

window.addEventListener("dragenter", function(e) {
    if (!dropAllowedOn(e.target)) {
        e.preventDefault();
        e.dataTransfer.effectAllowed = "none";
        e.dataTransfer.dropEffect = "none";
    }
}, false);

window.addEventListener("dragover", function(e) {
    if (!dropAllowedOn(e.target)) {
        e.preventDefault();
        e.dataTransfer.effectAllowed = "none";
        e.dataTransfer.dropEffect = "none";
    }
});

window.addEventListener("drop", function(e) {
    if (!dropAllowedOn(e.target)) {
        e.preventDefault();
        e.dataTransfer.effectAllowed = "none";
        e.dataTransfer.dropEffect = "none";
    }
});

window.__sendFirstBang = function() {
    bangNode.outlets['bang'].send({});
}
