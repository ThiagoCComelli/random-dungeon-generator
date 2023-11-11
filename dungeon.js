class Room {
  static ROOMS_INSTANCES_AMOUNT = 0;

  constructor(x, y, width, height, color) {
    this.id = `room-${Room.ROOMS_INSTANCES_AMOUNT++}`;

    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;

    this.color = color;
  }
}

class Dungeon {
  constructor(canvas, config) {
    this.canvas = canvas;

    this.rooms = [];
    this.mainRooms = [];

    this.config = config;
  }

  createRooms(quantity = 1) {
    for (let i = 0; i < quantity; i++) {
      const width = getRandomInt(
        this.config.size.room.minWidth,
        this.config.size.room.maxWidth
      );
      const height = getRandomInt(
        this.config.size.room.minHeight,
        this.config.size.room.maxHeight
      );

      const x =
        this.config.size.dungeon.width / 2 - width / 2 + getRandomInt(-50, 50);
      const y =
        this.config.size.dungeon.height / 2 -
        height / 2 +
        getRandomInt(-50, 50);

      const color = "#000";

      this.rooms.push(new Room(x, y, width, height, color));
    }

    return this.rooms;
  }

  chooseMainRooms(quantity = 15) {
    const shuffledRooms = shuffle(this.rooms);
    this.mainRooms = shuffledRooms.slice(0, quantity);

    for (const room of this.mainRooms) {
      room.color = "#000";
    }

    return this.mainRooms;
  }

  generateRooms() {
    this.createRooms(this.config.rooms);
    this.chooseMainRooms(this.config.mainRooms);
  }
}
