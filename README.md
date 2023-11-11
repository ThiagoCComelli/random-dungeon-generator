
# random-dungeon-generator



## Demo

https://github.com/ThiagoCComelli/random-dungeon-generator/assets/51216389/68d196b3-8faa-4717-a019-2af91f7ecb57



## Features

- Create N random cells and add to center point;
- Choose random M cells to be the main cells;
- Apply gravity pull force to separate all cells and resolve any bound box conflicts with all N cells;
- With the main cells are used to apply [Delaunay Triangulation](https://en.wikipedia.org/wiki/Delaunay_triangulation) to create a graph;
- With the graph use [Prim's Algorithm](https://en.wikipedia.org/wiki/Prim%27s_algorithm) to get the [Minimum Spanning Tree](https://en.wikipedia.org/wiki/Minimum_spanning_tree).




