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
        tile_can_pass: function() { return passable; },
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

function make_agent(world, ti, tj) {
    ti = (ti !== undefined) ? ti : 10;
    tj = (tj !== undefined) ? tj : 13;
    return new Agent(world, ti, tj, 25, 25);
}

// ---- Tests ----

describe('Agent constructor', function() {
    it('initializes with tile coordinates and computes pixel position', function() {
        var w = make_mock_world();
        var a = make_agent(w, 10, 13);
        assert(a.tile_i === 10, 'tile_i should be 10');
        assert(a.tile_j === 13, 'tile_j should be 13');
        assert(a.x === 10 * 30 + 15, 'x should be tile center pixel');
        assert(a.y === 13 * 30 + 15, 'y should be tile center pixel');
        assert(a.orientation === 'down', 'orientation should be down');
        assert(a.isMoving === false, 'isMoving should be false');
        assert(a.moveDuration === 8, 'moveDuration should be 8');
    });
});

describe('Agent.move() - starting a move', function() {
    it('starts interpolation when moving to a passable tile', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 10, 13);
        var result = a.move('right');
        assert(result === true, 'move should return true');
        assert(a.isMoving === true, 'should be moving');
        assert(a.tile_i === 11, 'tile_i should advance to 11');
        assert(a.tile_j === 13, 'tile_j should stay 13');
        assert(a.toX === 11 * 30 + 15, 'toX should be target tile center');
        assert(a.toY === 13 * 30 + 15, 'toY should be unchanged');
        assert(a.orientation === 'right', 'orientation should be right');
        // Pixel position should still be at start (interpolation hasn't advanced)
        assert(a.x === 10 * 30 + 15, 'x should not yet be moved');
    });

    it('rejects move to impassable tile', function() {
        var w = make_mock_world(false);
        var a = make_agent(w, 10, 13);
        var result = a.move('right');
        assert(result === false, 'move should return false');
        assert(a.isMoving === false, 'should not be moving');
        assert(a.tile_i === 10, 'tile_i should be unchanged');
        assert(a.tile_j === 13, 'tile_j should be unchanged');
        assert(a.orientation === 'right', 'should face attempted direction');
    });

    it('rejects move when already moving', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 10, 13);
        a.move('right');
        var result = a.move('up');
        assert(result === false, 'second move should be rejected');
        assert(a.tile_i === 11, 'tile_i should still be from first move');
        assert(a.orientation === 'right', 'orientation from first move');
    });

    it('toggles step counter for walk animation at start and halfway', function() {
        var w = make_mock_world(true);
        var a = make_agent(w);
        assert(a.step === 0, 'initial step should be 0');
        a.move('down');
        assert(a.step === 1, 'step should toggle to 1 at move start');
        for (var i = 0; i < 4; i++) a.update_movement();
        assert(a.step === 0, 'step should toggle to 0 at halfway');
        for (var i = 0; i < 4; i++) a.update_movement();
        assert(a.isMoving === false, 'move should be done');
        a.move('down');
        assert(a.step === 1, 'step should toggle to 1 again');
    });

    it('resets step to 0 when blocked', function() {
        var w = make_mock_world(false);
        var a = make_agent(w);
        a.step = 1;
        a.move('right');
        assert(a.step === 0, 'step should reset to 0 when blocked');
    });
});

describe('Agent.move() - all four directions', function() {
    it('moves up (tile_j decreases by 1)', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 10, 13);
        a.move('up');
        assert(a.tile_i === 10 && a.tile_j === 12, 'tile should be (10, 12)');
    });

    it('moves down (tile_j increases by 1)', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 10, 13);
        a.move('down');
        assert(a.tile_i === 10 && a.tile_j === 14, 'tile should be (10, 14)');
    });

    it('moves left (tile_i decreases by 1)', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 10, 13);
        a.move('left');
        assert(a.tile_i === 9 && a.tile_j === 13, 'tile should be (9, 13)');
    });

    it('moves right (tile_i increases by 1)', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 10, 13);
        a.move('right');
        assert(a.tile_i === 11 && a.tile_j === 13, 'tile should be (11, 13)');
    });
});

describe('Agent.update_movement() - interpolation', function() {
    it('advances pixel position linearly over moveDuration frames', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 10, 13);
        var startX = a.x;
        a.move('right');

        a.update_movement();
        assertClose(a.x, startX + 30 * (1/8), 0.01, 'frame 1 x');
        assert(a.isMoving === true, 'still moving at frame 1');

        a.update_movement();
        a.update_movement();
        a.update_movement();
        assertClose(a.x, startX + 30 * (4/8), 0.01, 'frame 4 x');

        a.update_movement();
        a.update_movement();
        a.update_movement();
        a.update_movement();
        assert(a.x === 11 * 30 + 15, 'should snap to target pixel');
        assert(a.isMoving === false, 'should no longer be moving');
    });

    it('does nothing when not moving', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 10, 13);
        var origX = a.x;
        var origY = a.y;
        a.update_movement();
        assert(a.x === origX && a.y === origY, 'position should be unchanged');
    });

    it('snaps exactly to target tile center', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 10, 13);
        a.move('up');
        for (var i = 0; i < 8; i++) a.update_movement();
        assert(a.x === 10 * 30 + 15, 'x should be tile 10 center');
        assert(a.y === 12 * 30 + 15, 'y should be tile 12 center');
    });
});

describe('WorldObject.sync_position()', function() {
    it('recomputes pixel position from tile coords', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 10, 13);
        a.tile_i = 5;
        a.tile_j = 7;
        a.sync_position();
        assert(a.x === 5 * 30 + 15, 'x should match new tile_i');
        assert(a.y === 7 * 30 + 15, 'y should match new tile_j');
    });
});

describe('Consecutive tile moves', function() {
    it('can chain two moves after completing the first', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 10, 13);

        a.move('right');
        for (var i = 0; i < 8; i++) a.update_movement();
        assert(a.tile_i === 11 && !a.isMoving, 'first move complete');

        var result = a.move('down');
        assert(result === true, 'second move accepted');
        for (var i = 0; i < 8; i++) a.update_movement();
        assert(a.tile_i === 11 && a.tile_j === 14, 'second move complete');
    });

    it('updates tile coords immediately on move start', function() {
        var w = make_mock_world(true);
        var a = make_agent(w, 10, 13);
        a.move('right');
        assert(a.tile_i === 11, 'tile_i updates immediately');
        assert(a.isMoving === true, 'still animating');
    });
});

describe('DIRECTION_DELTA', function() {
    it('has correct deltas for all four directions', function() {
        assert(DIRECTION_DELTA['up'].di === 0 && DIRECTION_DELTA['up'].dj === -1, 'up');
        assert(DIRECTION_DELTA['down'].di === 0 && DIRECTION_DELTA['down'].dj === 1, 'down');
        assert(DIRECTION_DELTA['left'].di === -1 && DIRECTION_DELTA['left'].dj === 0, 'left');
        assert(DIRECTION_DELTA['right'].di === 1 && DIRECTION_DELTA['right'].dj === 0, 'right');
    });
});

describe('GRID_SIZE constant', function() {
    it('is 30', function() {
        assert(GRID_SIZE === 30, 'GRID_SIZE should be 30');
    });
});

// ---- Summary ----
console.log('\n' + (failed === 0 ? '\x1b[32m' : '\x1b[31m') +
    passed + ' passed, ' + failed + ' failed\x1b[0m\n');

process.exit(failed > 0 ? 1 : 0);
