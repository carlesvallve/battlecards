/* PROCEDURAL CAVES | Jeff Thompson */

final int w = 100;
final int h = 50;
final int numSteps = 10000;
final float noiseInc = 0.3;

boolean saveIt = false;

int[][] level;
PImage levelImage;
int playerX = w/2;
int playerY = h/2;
int tileSizeX, tileSizeY;

void setup() {

  size(700, 350);
  noStroke();

  tileSizeX = width/w;
  tileSizeY = height/h;

  // create new blank level
  level = new int[h][w];
  for (int y=0; y<h; y++) {
    for (int x=0; x<w; x++) {
      level[y][x] = 0;
    }
  }

  // random walk to carve passages
  int px = playerX;    // spawn from previous player location (allows reset of level during play)
  int py = playerY;
  for (int i=0; i<numSteps; i++) {
    level[py][px] = 255;
    if (random(1) < 0.5) {        // randomly move in x or y dir - ensures we can get to every tile w/o diagonal movement
      px += int(random(-2, 2));
      // px = constrain(px, 1, w-2);
      if (px < 0) {
        px = w-1;
      } else if (px >= w) {
        px = 0;
      }
    } else {
      py += int(random(-2, 2));
      // py = constrain(py, 1, h-2);
      if (py < 0) {
        py = h-1;
      } else if (py >= h) {
        py = h-1;
      }
    }
  }

  // remove stray bits of stone
  for (int y=1; y<h-1; y++) {
    for (int x=1; x<w-1; x++) {
      if (level[y][x] == 0 &&
        level[y-1][x] == 255 &&
        level[y][x+1] == 255 && 
        level[y+1][x] == 255 && 
        level[y][x-1] == 255) {
        level[y][x] = 255;
      }
    }
  }

  // fill open spaces with Perlin noise for heights
  float yOffset = 0.0;
  for (int y=0; y<h; y++) {
    float xOffset = 0.0;
    yOffset += noiseInc;
    for (int x=0; x<w; x++) {
      xOffset += noiseInc;
      if (level[y][x] == 255) {
        int newTile = int(noise(xOffset, yOffset)*255);
        newTile = constrain(newTile, 1, 255);              // new tile should not be solid stone (0)
        level[y][x] = newTile;
      }
    }
  }

  // create image of level to display onscreen
  levelImage = createImage(w, h, RGB);
  levelImage.loadPixels();
  for (int y=0; y<h; y++) {
    for (int x=0; x<w; x++) {
      levelImage.pixels[y*w+x] = color(level[y][x]);
    }
  }
  levelImage.updatePixels();

  // save if specified
  if (saveIt) {
    noSmooth();
    image(levelImage, 0, 0, width, height);
    fill(255, 150, 0);
    rect(playerX * tileSizeX, playerY * tileSizeY, tileSizeX, tileSizeY);
    incrementAndSave(sketchPath("") + "/maps", "map", 3);
  }
}

void draw() {

  // display level (noSmooth for sharp pixel edges)
  noSmooth();
  image(levelImage, 0, 0, width, height);

  // player
  fill(255, 150, 0);
  rect(playerX * tileSizeX, playerY * tileSizeY, tileSizeX, tileSizeY);
}

void keyPressed() {
  if (key == 32) {
    setup();
  } 

  if (key == CODED) {
    if (keyCode == UP) {
      if (playerY-1 < 0 && level[h-1][playerX] != 0) {
        playerY = h-1;
      } else if (playerY-1 >= 0 && level[playerY-1][playerX] != 0) {
        playerY -= 1;
      }
    } else if (keyCode == RIGHT) {
      if (playerX+1 > w-1 && level[playerY][0] != 0) {
        playerX = 0;
      } else if (playerX+1 <= w-1 && level[playerY][playerX+1] != 0) {
        playerX += 1;
      }
    } else if (keyCode == DOWN) {
      if (playerY+1 > h-1 && level[0][playerX] != 0) {
        playerY = 0;
      } else if (playerY+1 <= h-1 && level[playerY+1][playerX] != 0) {
        playerY += 1;
      }
    } else if (keyCode == LEFT) {
      if (playerX-1 < 0 && level[playerY][w-1] != 0) {
        playerX = w-1;
      } else if (playerX-1 >= 0 && level[playerY][playerX-1] != 0) {
        playerX -= 1;
      }
    }
  }
}