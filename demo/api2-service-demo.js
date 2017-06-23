var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let Api2ServiceDemo = class Api2ServiceDemo extends LssProviderBehavior(Polymer.Element) {
    constructor() {
        super(...arguments);
        this.fruits = [];
        this.error = "none";
        this.names = ["Apple", "Banana", "Apricot", "Blackcurrant", "Blueberry", "Orange", "Strawberry", "Tomato", "Redcurrant"];
    }
    ready() {
        super.ready();
        this.provideInstance("UserManager", this.$.userManager);
    }
    getRandomFruitName() {
        return this.names[Math.floor(Math.random() * this.names.length)];
    }
    getFruits() {
        return __awaiter(this, void 0, void 0, function* () {
            this.error = "none";
            var service = this.$.service;
            var result;
            try {
                result = yield service.getAsync("Fruits/?$top=5&$orderby=Id desc", "Testing");
            }
            catch (error) {
                this.error = error;
                return;
            }
            this.fruits = result.toList();
        });
    }
    createFruit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.error = "none";
            var service = this.$.service;
            var dto = new Fruit();
            dto.Name = this.getRandomFruitName();
            var fruit;
            try {
                fruit = yield service.postAsync("Fruits", dto);
            }
            catch (error) {
                this.error = error;
                return;
            }
            this.push("fruits", fruit);
        });
    }
    deleteFruit(e) {
        return __awaiter(this, void 0, void 0, function* () {
            this.error = "none";
            var id = e.target.getAttribute("object-id");
            var service = this.$.service;
            if (id > 0) {
                try {
                    yield service.deleteAsync(`Fruits(${id})`);
                }
                catch (error) {
                    this.error = error;
                    return;
                }
                var fruit = this.fruits.filter(o => o.Id === parseInt(id) || 0);
                if (fruit.length === 1) {
                    var index = this.fruits.indexOf(fruit[0]);
                    this.splice('fruits', index, 1);
                }
            }
        });
    }
    patchFruit(e) {
        return __awaiter(this, void 0, void 0, function* () {
            this.error = "none";
            var id = e.target.getAttribute("object-id");
            var service = this.$.service;
            var dto;
            var name = this.getRandomFruitName();
            dto = new ODataDto();
            dto.Name = name;
            if (id > 0) {
                try {
                    yield service.patchAsync(`Fruits(${id})`, dto);
                }
                catch (error) {
                    this.error = error;
                    return;
                }
                var fruit = this.fruits.filter(o => o.Id === parseInt(id) || 0);
                if (fruit.length === 1) {
                    var index = this.fruits.indexOf(fruit[0]);
                    this.set(`fruits.${index}.Name`, name);
                }
            }
        });
    }
    patchReturnDtoFruit(e) {
        return __awaiter(this, void 0, void 0, function* () {
            this.error = "none";
            var id = e.target.getAttribute("object-id");
            var service = this.$.service;
            var dto;
            var name = this.getRandomFruitName();
            dto = new ODataDto();
            dto.Name = name;
            if (id > 0) {
                try {
                    var returnFruit = yield service.patchReturnDtoAsync(`Fruits(${id})`, dto);
                }
                catch (error) {
                    this.error = error;
                    return;
                }
                var fruit = this.fruits.filter(o => o.Id === parseInt(id) || 0);
                if (fruit.length === 1) {
                    var index = this.fruits.indexOf(fruit[0]);
                    this.set(`fruits.${index}.Name`, returnFruit.Name);
                }
            }
        });
    }
    attached() {
    }
};
__decorate([
    property(),
    __metadata("design:type", Array)
], Api2ServiceDemo.prototype, "fruits", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], Api2ServiceDemo.prototype, "error", void 0);
__decorate([
    listen("getButton", "tap"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Api2ServiceDemo.prototype, "getFruits", null);
__decorate([
    listen("createButton", "tap"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Api2ServiceDemo.prototype, "createFruit", null);
Api2ServiceDemo = __decorate([
    customElement("api2-service-demo")
], Api2ServiceDemo);
class Fruit extends ODataDto {
}
