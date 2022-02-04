class TestCanvas extends Canvas {

    
    draw_contents() {
        
        fill(mouseX % 255, mouseY % 255, 150)
        square(self.x, min(mouseY, self.canvas_height - self.square_width), self.square_width)
        
        if (self.x + self.square_width >= self.canvas_width) {
            self.direction = -1 
            return
        }

        if (self.x <= 0) {
            self.direction = 1
        }

        self.x += self.direction
    }
}

test_canvas = TestCanvas(
    120, // x
    120, // y
    30, // object_width
    30, // object_height
    TestCanvas(200, 200) // canvas
)

stoner_house_sign = TextObject(
    30 * 12,
    30 * 11,
    30,
    30,
    [['Stoner House']] // dialogue
)