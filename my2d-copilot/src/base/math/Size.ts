export class Size {
    static Create(width: number = 0, height: number = 0): Size {
        return new Size(width, height);
    }

    public width: number;
    public height: number;

    public constructor(width: number = 0, height: number = 0) {
        this.width = width;
        this.height = height;
    }

    public static get zero(): Size {
        return new Size();
    }

    public static get one(): Size {
        return new Size(1, 1);
    }    

    public set(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }
}
