// Node.js test runner for tile-based movement
// Run with: node tests/test_movement.js

// ---- Minimal test framework ----
let passed = 0, failed = 0;

function describe(name, fn) {
    console.log('\n\x1b[36m' + name + '\x1b[0m');
    fn();
}

function it(name, fn) {
    try {
        fn();
        console.log('  \x1b[32mPASS\x1b[0m ' + name);
        passed++;
    } catch (e) {
        console.log('  \x1b[31mFAIL\x1b[0m ' + name);
        console.log('    ' + e.message);
        failed++;
    }
}

function assert(condition, msg) {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function assertClose(a, b, epsilon, msg) {
    if (Math.abs(a - b) > (epsilon || 0.01)) {
        throw new Error((msg || '') + ' expected ' + b + ' got ' + a);
    }
}

// ---- Mock p5.js globals needed by source files ----
global.fill = function() {};
global.circle = function() {};
global.image = function() {};
global.push = function() {};
global.pop = function() {};
global.scale = function() {};
global.min = Math.min;
global.max = Math.max;

global.CHAR_SPRITES_CONFIG = {
    'offset': 16, 'border': 0,
    'colors': ['red', 'blue', 'green', 'brown'],
    'color_offset': 8
};

// ---- Load source files ----
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadScript(filePath) {
    const code = fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
    vm.runInThisContext(code, { filename: filePath });
}

loadScript('src/object.js');
loadScript('src/agent.js');

// ---- Mock environment ----
function make_mock_env(passable) {
    return {
        object_can_pass: function() { return passable; },
        redraw_at_object: function() {},
        move_environment: function() {},
        get_x_offset: function() { return 0; },
        get_y_offset: function() { return 0; },
        check_passage: function() { return null; }
    };
}

function make_mock_world(passable) {
    var w = {};
    w.current_env = make_mock_env(passable !== false);
    w.player = null;
    w.char_sprite_arr = [];
    return w;
}

function make_agent(world, x, y) {
    x = (x !== undefined) ? x : 315;  // tile center: 30*10 + 15
    y = (y !== undefined) ? y : 405;  // tile center: 30*13 + 15
    return new Agent(world, x, y, 25, 25, 30);
}

// ---- Tests ----

describe('Agent constructor', function() {
    it('initializes at given position with correct defaults', function() {
        var w = make_mock_world();
        var a = make_agent(w);
        assert(a.x === 315, 'x should be 315');
        assert(a.y === 405, 'y should be 405');
        assert(a.step_size === 30, 'step_size should be 30');
        assert(a.orientation === 'down', 'orientation should be down');
        assert(a.isMoving === false, 'isMoving should be false');
        assert(a.moveProgress === 0, 'moveProgress should be 0');
        assert(a.moveDuration === 8, 'moveDuration should be 8');
    });
});

describe('Agent.move() - starting a move', function() {
    it('starts interpolation when moving to a passable tile', function() {
        var w = make_mock_world(true);
        var a = make_agent(w);
        var result = a.move('right');
        assert(result === true, 'move should return true');
        assert(a.isMoving === true, 'should be moving');
        assert(a.fromX === 315, 'fromX should be 315');
        assert(a.fromY === 405, 'fromY should be 405');
        assert(a.toX === 345, 'toX should be one tile right (345)');
        assert(a.toY === 405, 'toY should be unchanged');
        assert(a.orientation === 'right', 'orientation should be right');
        // Position should still be at start (interpolation hasn't advanced)
        assert(a.x === 315, 'x should not yet be moved');
        assert(a.y === 405, 'y should not yet be moved');
    });

    it('rejects move to impassable tile', function() {
        var w = make_mock_world(false);
        var a = make_agent(w);
        var result = a.move('right');
        assert(result === false, 'move should return false');
        assert(a.isMoving === false, 'should not be moving');
        assert(a.x === 315, 'x should be unchanged');
        assert(a.y === 405, 'y should be unchanged');
        assert(a.orientation === 'right', 'should still face the attempted direction');
    });

    it('rejects move when already moving', function() {
        var w = make_mock_world(true);
        var a = make_agent(w);
        a.move('right');
        var result = a.move('up');
        assert(result === false, 'second move should be rejected');
        assert(a.toX === 345, 'target should still be from first move');
        assert(a.orientation === 'right', 'orientation should be from first move');
    });

    it('toggles step counter for walk animation at start and halfway', function() {
        var w = make_mock_world(true);
        var a = make_agent(w);
        assert(a.step === 0, 'initial step should be 0');
        a.move('down');
        assert(a.step === 1, 'step should toggle to 1 at move start');
        // advance to halfway (frame 4) — step toggles again
        for (var i = 0; i < 4; i++) a.update_movement();
        assert(a.step === 0, 'step should toggle to 0 at halfway');
        // complete the move
        for (var i = 0; i < 4; i++) a.update_movement();
        assert(a.isMoving === false, 'move should be done');
        // start second move
        a.move('down');
        assert(a.step === 1, 'step should toggle to 1 again');
    });

    it('resets step to 0 when blocked', function() {
        var w = make_mock_world(false);
        var a = make_agent(w);
        a.step = 1; // simulate mid-animation
        a.move('right');
        assert(a.step === 0, 'step should reset to 0 when blocked');
    });
});

describe('Agent.move() - all four directions', function() {
    it('moves up (y decreases by grid_size)', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 315, 405);
        a.move('up');
        assert(a.toX === 315 && a.toY === 375, 'target should be (315, 375)');
    });

    it('moves down (y increases by grid_size)', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 315, 405);
        a.move('down');
        assert(a.toX === 315 && a.toY === 435, 'target should be (315, 435)');
    });

    it('moves left (x decreases by grid_size)', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 315, 405);
        a.move('left');
        assert(a.toX === 285 && a.toY === 405, 'target should be (285, 405)');
    });

    it('moves right (x increases by grid_size)', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 315, 405);
        a.move('right');
        assert(a.toX === 345 && a.toY === 405, 'target should be (345, 405)');
    });
});

describe('Agent.update_movement() - interpolation', function() {
    it('advances position linearly over moveDuration frames', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 315, 405);
        a.move('right');

        // After 1 frame: 1/8 of the way
        a.update_movement();
        assertClose(a.x, 315 + 30 * (1/8), 0.01, 'frame 1 x');
        assert(a.isMoving === true, 'still moving at frame 1');

        // After 4 frames total: halfway
        a.update_movement();
        a.update_movement();
        a.update_movement();
        assertClose(a.x, 315 + 30 * (4/8), 0.01, 'frame 4 x');
        assert(a.isMoving === true, 'still moving at frame 4');

        // After 8 frames total: arrives
        a.update_movement();
        a.update_movement();
        a.update_movement();
        a.update_movement();
        assert(a.x === 345, 'should snap to target x');
        assert(a.y === 405, 'y should be unchanged');
        assert(a.isMoving === false, 'should no longer be moving');
    });

    it('does nothing when not moving', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 315, 405);
        a.update_movement();
        assert(a.x === 315 && a.y === 405, 'position should be unchanged');
        assert(a.isMoving === false, 'should not be moving');
    });

    it('snaps exactly to target (no floating point drift)', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 315, 405);
        a.move('up');
        for (var i = 0; i < 8; i++) a.update_movement();
        assert(a.x === 315, 'x should be exactly 315');
        assert(a.y === 375, 'y should be exactly 375');
    });

    it('interpolates y correctly for vertical movement', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 315, 405);
        a.move('down');

        // halfway
        for (var i = 0; i < 4; i++) a.update_movement();
        assertClose(a.y, 405 + 15, 0.01, 'halfway y');
        assert(a.x === 315, 'x unchanged during vertical move');
    });
});

describe('Agent.snap_to_grid()', function() {
    it('snaps slightly off-center position to tile center', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 302, 388);
        a.snap_to_grid();
        assert(a.x === 315, 'x should snap to tile center 315');
        assert(a.y === 375, 'y should snap to tile center 375');
    });

    it('leaves already-centered position unchanged', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 315, 405);
        a.snap_to_grid();
        assert(a.x === 315, 'x unchanged');
        assert(a.y === 405, 'y unchanged');
    });
});

describe('Consecutive tile moves', function() {
    it('can chain two moves after completing the first', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 315, 405);

        a.move('right');
        for (var i = 0; i < 8; i++) a.update_movement();
        assert(a.x === 345 && !a.isMoving, 'first move should be complete');

        var result = a.move('down');
        assert(result === true, 'second move should be accepted');
        for (var i = 0; i < 8; i++) a.update_movement();
        assert(a.x === 345 && a.y === 435, 'second move should be complete');
        assert(!a.isMoving, 'should not be moving');
    });

    it('correctly tracks fromX/fromY for second move', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 315, 405);

        a.move('right');
        for (var i = 0; i < 8; i++) a.update_movement();

        a.move('right');
        assert(a.fromX === 345, 'fromX should be previous target');
        assert(a.toX === 375, 'toX should be next tile');
    });
});

describe('get_new_location with multiplier', function() {
    it('returns position one tile ahead with multiplier=1', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 315, 405);
        var loc = a.get_new_location('right', 1);
        assert(loc.x === 345 && loc.y === 405, 'one tile right');
    });

    it('uses current position (not target) for calculation', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 315, 405);
        a.move('right');
        // Mid-interpolation, get_new_location should use current x (still 315)
        var loc = a.get_new_location('down', 1);
        assert(loc.x === 315 && loc.y === 435, 'should be based on current position');
    });
});

describe('Move vector dictionary', function() {
    it('produces correct vectors for grid_size=30', function() {
        var vecs = get_move_vec_dict(30);
        assert(vecs['up'].x === 0 && vecs['up'].y === -30, 'up');
        assert(vecs['down'].x === 0 && vecs['down'].y === 30, 'down');
        assert(vecs['left'].x === -30 && vecs['left'].y === 0, 'left');
        assert(vecs['right'].x === 30 && vecs['right'].y === 0, 'right');
    });
});

// ---- Summary ----
console.log('\n' + (failed === 0 ? '\x1b[32m' : '\x1b[31m') +
    passed + ' passed, ' + failed + ' failed\x1b[0m\n');

process.exit(failed > 0 ? 1 : 0);
