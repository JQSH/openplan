/*jshint browser: true, devel: true, node: true*/
/*global BasicGame,Phaser*/
'use strict';

BasicGame.Game = function (game) {};

BasicGame.Game.prototype = {

    create: function () {
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.game.stage.backgroundColor = "E79797";
        
        this.time = 0;
        this.dragging = false;
        this.wave = {};
        this.wave.number = 1;
        this.wave.enemies = 0;
        
        var menu = this.add.sprite(600, 0, 'box');
        menu.scale.x = 100;
        menu.scale.y = 100;
        menu.tint = 0x7F7F7F;
        
        var board = this.add.sprite(0, 80, 'box');
        board.scale.x = 15;
        board.scale.y = 11;
        board.tint = 0xF7E7E7;
        
        this.map = 1;
        this.mapChange = false;
        
        this.groups();
        this.mapping();
        this.boundary();
        this.currencySettings();
        
        this.waterTower = this.game.add.button(630, 80, 'box');
        this.waterTower.tint = 0x46c4db;
        this.waterTower.type = 'water';
        this.waterTower.scale.setTo(1.5);
        this.waterTower.events.onInputDown.add(function () {
            if (this.menuItems.countLiving() < 1 && this.currency.total >= 10) {
                this.menuItem(this.waterTower);
            }
        }, this);
        
        this.magicTower = this.game.add.button(710, 80, 'box');
        this.magicTower.tint = 0xf647b6;
        this.magicTower.type = 'magic';
        this.magicTower.scale.setTo(1.5);
        this.magicTower.events.onInputDown.add(function () {
            if (this.menuItems.countLiving() < 1 && this.currency.total >= 20) {
                this.menuItem(this.magicTower);
            }
        }, this);
        
        this.groundTower = this.game.add.button(630, 160, 'box');
        this.groundTower.tint = 0xEB6841;
        this.groundTower.type = 'ground';
        this.groundTower.scale.setTo(1.5);
        this.groundTower.events.onInputDown.add(function () {
            if (this.menuItems.countLiving() < 1 && this.currency.total >= 50) {
                this.menuItem(this.groundTower);
            }
        }, this);
        
        this.grassTower = this.game.add.button(710, 160, 'box');
        this.grassTower.tint = 0x76d646;
        this.grassTower.type = 'grass';
        this.grassTower.scale.setTo(1.5);
        this.grassTower.events.onInputDown.add(function () {
            if (this.menuItems.countLiving() < 1 && this.currency.total >= 100) {
                this.menuItem(this.grassTower);
            }
        }, this);
        
        //button.onInputOver.add(over, this);
        //button.onInputOut.add(out, this);
        //button.onInputUp.add(up, this);
        
        this.game.time.events.loop(100, this.events, this); // 1000ms = 1 second

    },
    
    events: function () {
        this.time += 1;
        
        switch (this.wave.number) {
            case 1:
                if (this.wave.enemies < 10) {
                    if (this.time % 10 === 0 && this.time !== 0) {
                        this.enemy(20);
                    }
                }
                else if (this.wave.enemies >= 10) {
                    this.wave.enemies = 0;
                    this.wave.number++;
                }
                break;
            case 2:
                if (this.wave.enemies < 10) {
                    if (this.time % 10 === 0 && this.time !== 0) {
                        this.enemy(40);
                    }
                }
                else if (this.wave.enemies >= 10) {
                    this.wave.enemies = 0;
                    this.wave.number++;
                }
                break;
        }
    },
        
    
    groups: function () {
        this.maps = this.game.add.group();
        this.maps.enableBody = true;
        this.maps.createMultiple(200, 'box');
        
        this.boundaries = this.game.add.group();
        this.boundaries.enableBody = true;
        this.boundaries.createMultiple(200, 'box');
        
        this.menuItems = this.game.add.group();
        this.menuItems.enableBody = true;
        this.menuItems.createMultiple(2, 'box');
        
        this.towers = this.game.add.group();
        this.towers.enableBody = true;
        this.towers.createMultiple(100, 'box');
        
        this.waterAreas = this.game.add.group();
        this.waterAreas.enableBody = true;
        this.waterAreas.createMultiple(100, 'box');
        this.waterAreas.lastOverlapped = this.game.time.now;
        
        this.magicAreas = this.game.add.group();
        this.magicAreas.enableBody = true;
        this.magicAreas.createMultiple(100, 'box');
        this.magicAreas.lastOverlapped = this.game.time.now;
        
        this.groundAreas = this.game.add.group();
        this.groundAreas.enableBody = true;
        this.groundAreas.createMultiple(100, 'box');
        this.groundAreas.lastOverlapped = this.game.time.now;
        
        this.grassAreas = this.game.add.group();
        this.grassAreas.enableBody = true;
        this.grassAreas.createMultiple(100, 'box');
        this.grassAreas.lastOverlapped = this.game.time.now;
        
        this.bullets = this.game.add.group();
        this.bullets.enableBody = false;
        this.bullets.createMultiple(6500, 'box');
        
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(200, 'box');
        
        this.dyingEnemies = this.game.add.group();
        this.dyingEnemies.enableBody = false;
        this.dyingEnemies.createMultiple(10, 'box');
    },
    
    currencySettings: function () {
        this.currency = this.add.sprite(645, 25, 'box');
        this.currency.scale.x = 0.5;
        this.currency.scale.y = 0.5;
        this.currency.tint = 0xffcb4f;
        this.currency.angle = 45;
        this.currency.text = this.game.add.text(668, 24, '100', { font: "24px Futura", fill:
        "#ffffff"});
        this.currency.total = 100;
    },
    
    mapping: function () {
        var maps = this.maps;
        var tile = function (x, y, scaleX, scaleY, directionX, directionY) {
            var t = maps.getFirstDead();
            t.tint = 0x000000;
            t.alpha = 0.125;
            t.scale.x = scaleX;
            t.scale.y = scaleY;
            t.reset(x, y);
            t.dirX = directionX;
            t.dirY = directionY;
            t.body.width = 40 * scaleX;
            t.body.height = 40 * scaleY;
            t.visible = false;
        };
        if (this.map === 1) {
            tile(0, 290, 0.25, 0.25, 1, 0);
            tile(70, 290, 0.25, 0.25, 0, 1);
            tile(50, 470, 0.25, 0.25, 1, 0);
            tile(150, 450, 0.25, 0.25, 0, -1);
            tile(140, 200, 0.25, 0.25, -1, 0);
            tile(40, 210, 0.25, 0.25, 0, -1);
            tile(50, 120, 0.25, 0.25, 1, 0);
            tile(470, 130, 0.25, 0.25, 0, 1);
            tile(470, 390, 0.25, 0.25, -1, 0);
            tile(360, 380, 0.25, 0.25, 0, -1);
            tile(380, 200, 0.25, 0.25, -1, 0);
            tile(200, 220, 0.25, 0.25, 0, 1);
            tile(210, 310, 0.25, 0.25, 1, 0);
            tile(310, 290, 0.25, 0.25, 0, 1);
            tile(300, 390, 0.25, 0.25, -1, 0);
            tile(200, 370, 0.25, 0.25, 0, 1);
            tile(210, 470, 0.25, 0.25, 1, 0);
            tile(550, 460, 0.25, 0.25, 0, -1);
            tile(530, 120, 0.25, 0.25, 1, 0);
        }
    },
    
    boundary: function () {
    var boundaries = this.boundaries;
        var tile = function (x, y, scaleX, scaleY, directionX, directionY) {
            var t = boundaries.getFirstDead();
            t.tint = 0x000000;
            t.alpha = 0.125;
            t.scale.x = scaleX;
            t.scale.y = scaleY;
            t.reset(x, y);
            t.dirX = directionX;
            t.dirY = directionY;
            t.body.width = 40 * scaleX;
            t.body.height = 40 * scaleY;
        };
        if (this.map === 1) {
            tile(0, 280, 1, 1, 1, 0);
            tile(40, 280, 1, 4, 0, 1);
            tile(40, 440, 2, 1, 1, 0);
            tile(120, 240, 1, 6, 0, -1);
            tile(80, 200, 2, 1, -1, 0);
            tile(40, 160, 1, 2, 0, -1);
            tile(40, 120, 10, 1, 1, 0);
            tile(440, 120, 1, 6, 0, 1);
            tile(400, 360, 2, 1, -1, 0);
            tile(360, 240, 1, 4, 0, 1);
            tile(240, 200, 4, 1, -1, 0);
            tile(200, 200, 1, 2, 0, 1);
            tile(200, 280, 2, 1, 1, 0);
            tile(280, 280, 1, 2, 0, 1);
            tile(240, 360, 2, 1, -1, 0);
            tile(200, 360, 1, 2, 0, 1);
            tile(200, 440, 8, 1, 1, 0);
            tile(520, 160, 1, 8, 0, -1);
            tile(520, 120, 2, 1, 0, -1);
        }
    },
    
    menuItem: function (icon) {
        var menuItem = this.menuItems.getFirstDead();
        menuItem.anchor.set(0.5);
        menuItem.reset(this.game.input.x,this.game.input.y);
        menuItem.x = this.game.input.x;
        menuItem.y = this.game.input.y;
        menuItem.alpha = 0;
        menuItem.tint = icon.tint;
        menuItem.originalTint = icon.tint;
        menuItem.overlapping = true;
        menuItem.type = icon.type;
        /*menuItem.input.draggable = false;
        menuItem.allowHorizontalDrag = false;
        menuItem.allowVerticalDrag = false;*/
        this.dragging = true;
    },
    
    tower: function (menuItem) {
        var tower = this.towers.getFirstDead();
        tower.anchor.set(0.5);
        tower.body.mass = 9999999;
        tower.reset(menuItem.x, menuItem.y);
        tower.tint = menuItem.tint;
        tower.type = menuItem.type;
        if (menuItem.type === 'water') {
            this.currency.total -= 10;
            this.currency.text.text = this.currency.total;
        } else if (menuItem.type === 'magic') {
            this.currency.total -= 20;
            this.currency.text.text = this.currency.total;
        } else if (menuItem.type === 'ground') {
            this.currency.total -= 50;
            this.currency.text.text = this.currency.total;
        } else if (menuItem.type === 'grass') {
            this.currency.total -= 100;
            this.currency.text.text = this.currency.total;
        }
        this.towerArea(tower);
    },
    
    towerArea: function (tower) {
        var area;
        if (tower.type === 'water') {
            area = this.waterAreas.getFirstDead();
        } else if (tower.type === 'magic') {
            area = this.magicAreas.getFirstDead();
        } else if (tower.type === 'ground') {
            area = this.groundAreas.getFirstDead();
        } else if (tower.type === 'grass') {
            area = this.grassAreas.getFirstDead();
        }
        area.scale.setTo(3);
        area.body.width = 40 * area.scale.x;
        area.body.height = 40 * area.scale.y;
        area.anchor.set(0.5);
        area.alpha = 0.25;
        area.reset(tower.x, tower.y);
        area.visible = false;
        area.fired = false;
        area.tint = tower.tint;
        area.type = tower.type;
    },
    
    bullet: function (towerArea, enemy) {
        var bullet = this.bullets.getFirstDead();
        bullet.angle = 0;
        bullet.alpha = 1;
        bullet.scale.setTo(0.25);
        bullet.anchor.set(0.5);
        bullet.tint = towerArea.tint + 9999;
        bullet.reset(towerArea.x, towerArea.y);
        bullet.lifespan = 1000;
        bullet.firing = false;
        var game = this.game;
        var rnd1 = this.rnd.between(0,0.5);
        var rnd2 = this.rnd.between(1,2);
        var bulletEffects = function (target, dmg, effectOne, effectTwo, effectThree) {
            if (target === 'single') {
                if (enemy.body.velocity.x > 0) {
                    game.add.tween(bullet).to({x: enemy.x + enemy.body.velocity.x * 0.8, y: enemy.y + 10}, 1000 ,
                                            Phaser.Easing.Quartic.InOut, true /* Autostart? */, 0, false /* yoyo? */);
                    game.time.events.add(Math.abs(enemy.body.velocity.x) * 5, function () {
                        enemy.damage(dmg);
                        //enemy.text.text = enemy.health;
                    }, this);
                } else if (enemy.body.velocity.x < 0) {
                    game.add.tween(bullet).to({x: enemy.x + enemy.body.velocity.x * 0.7, y: enemy.y + 10}, 1000 ,
                                            Phaser.Easing.Quartic.InOut, true /* Autostart? */, 0, false /* yoyo? */);
                    game.time.events.add(Math.abs(enemy.body.velocity.x) * 5, function () {
                        enemy.damage(dmg);
                        //enemy.text.text = enemy.health;
                    }, this);
                } else if (enemy.body.velocity.y > 0) {
                    game.add.tween(bullet).to({x: enemy.x + 10, y: enemy.y + enemy.body.velocity.y * 0.8}, 1000 ,
                                            Phaser.Easing.Quartic.InOut, true /* Autostart? */, 0, false /* yoyo? */);
                    game.time.events.add(Math.abs(enemy.body.velocity.x) * 5, function () {
                        enemy.damage(dmg);
                        //enemy.text.text = enemy.health;
                    }, this);
                } else if (enemy.body.velocity.y < 0) {
                    game.add.tween(bullet).to({x: enemy.x + 10, y: enemy.y + enemy.body.velocity.y * 0.7}, 1000,
                                            Phaser.Easing.Quartic.InOut, true /* Autostart? */, 0, false /* yoyo? */);
                    game.time.events.add(Math.abs(enemy.body.velocity.x) * 5, function () {
                        enemy.damage(dmg);
                        //enemy.text.text = enemy.health;
                    }, this);
                }
            } else if (target === 'AOE') {
                game.add.tween(bullet.scale).to({ x: 3, y: 3}, 1000 , // Duration in ms
                                          Phaser.Easing.Quartic.InOut, true /* Autostart? */, 0, false /* yoyo? */);
                game.time.events.add(Math.abs(enemy.body.velocity.x) * 5, function () {
                    if (!bullet.firing) {
                        enemy.damage(dmg);
                        //enemy.text.text = enemy.health;
                        bullet.firing = true;
                        game.time.events.add(300, function () {
                            bullet.firing = false;
                        }, this);
                    }
                }, this);
            } if (effectOne === 'rotate' || effectTwo === 'rotate' || effectThree === 'rotate') {
                game.add.tween(bullet).to({angle: 720}, 1000 , // Duration in ms
                                          Phaser.Easing.Quartic.InOut, true /* Autostart? */, 0, false /* yoyo? */);
            } if (effectOne === 'randomScale' || effectTwo === 'randomScale' || effectThree === 'randomScale') {
                game.add.tween(bullet.scale).to({ x: rnd1, y: rnd2}, 1000 , // Duration in ms
                                          Phaser.Easing.Quartic.InOut, true /* Autostart? */, 0, false /* yoyo? */);
            } if (effectOne === 'scale' || effectTwo === 'scale' || effectThree === 'scale') {
                game.add.tween(bullet.scale).to({ x: 1, y: 1}, 1000 , // Duration in ms
                                          Phaser.Easing.Quartic.InOut, true /* Autostart? */, 0, false /* yoyo? */);
            } if (effectOne === 'vanish' || effectTwo === 'vanish' || effectThree === 'vanish') {
                game.add.tween(bullet).to({alpha: 0}, 1000, // Duration in ms
                                            Phaser.Easing.Circular.InOut, true /* Autostart? */, 0, false /* yoyo? */);
            } if (effectOne === 'phaser' || effectTwo === 'phaser' || effectThree === 'phaser') {
                bullet.angle = 45;
                game.add.tween(bullet.scale).to({ x: 0.5, y: 0.5}, 500, // Duration in ms
                                          Phaser.Easing.Elastic.InOut, true /* Autostart? */, 0, false /* yoyo? */);
            }
                
                
        };
        //(Math.abs(enemy.body.velocity.x)
        if (towerArea.type === 'water') {
            bulletEffects('single', 2, 'vanish');
        } else if (towerArea.type === 'magic') {
            bulletEffects('single', 10, 'phaser', 'vanish');
        } else if (towerArea.type === 'ground') {
            bulletEffects('AOE', 10,  'vanish');
        } else if (towerArea.type === 'grass') {
            bulletEffects('single', 2, 'rotate', 'vanish', 'randomScale');
            enemy.body.velocity.x = 10;
        }
            
            
        /*this.add.tween(enemy).to({alpha: -0.1}, 1000 , // Duration in ms
        Phaser.Easing.Circular.InOut, true, 0, 
        false);*/
    },
    
    enemy: function (hp) {
        var vanish = null;
        var shrink = null;
        var enemy = this.enemies.getFirstDead();
        enemy.alive = true;
        enemy.scale.setTo(0.5);
        enemy.tint = 0x79797F;
        enemy.reset(-20, 290);
        enemy.body.velocity.x = 100;
        enemy.body.width = 20;
        enemy.body.height = 20;
        /*enemy.text = this.game.add.text(19, 20, hp, { font: "40px Helvetica", fill:
        "#ffffff" });
        enemy.text.anchor.set(0.5);
        enemy.text.scale.setTo(0.5);
        enemy.addChild(enemy.text);*/
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
        enemy.health = hp;
        this.wave.enemies++;
        enemy.events.onKilled.addOnce(function () {
            this.dyingEnemy(enemy);
            enemy.destroy();
            switch (this.wave.number) {
                case 1:
                    this.currency.total += 1;
                    this.currency.text.text = this.currency.total;
                    break;
                case 2:
                    this.currency.total += 1;
                    this.currency.text.text = this.currency.total;
                    break;
                case 3:
                    this.currency.total += 1;
                    this.currency.text.text = this.currency.total;
                    break;
            }
        }, this);
    },
    
    dyingEnemy: function (enemy) {
        var die = function () {
            dyingEnemy.kill();
        };
        var dyingEnemy = this.dyingEnemies.getFirstDead();
        dyingEnemy.alpha = 1;
        dyingEnemy.tint = enemy.tint;
        dyingEnemy.scale = enemy.scale;
        dyingEnemy.reset(enemy.x + enemy.body.width / 2, enemy.y + enemy.body.height / 2);
        dyingEnemy.anchor.set(0.5);
        var vanish = this.game.add.tween(dyingEnemy).to({alpha: 0}, 333, // Duration in ms
                                     Phaser.Easing.Circular.InOut, true /* Autostart? */, 0, false /* yoyo? */);
        var shrink = this.game.add.tween(dyingEnemy.scale).to({ x: 0, y: 0}, 333 , // Duration in ms
                                          Phaser.Easing.Quartic.InOut, true /* Autostart? */, 0, false /* yoyo? */);
        shrink.onComplete.add(die, this);
    },

    update: function () {
        
        if (this.currency.total < 100) {
            this.grassTower.alpha = 0.3;
        } else if (this.currency.total >= 100) {
            this.grassTower.alpha = 1;
            this.groundTower.alpha = 1;
            this.magicTower.alpha = 1;
            this.waterTower.alpha = 1;
        }
        if (this.currency.total < 50) {
            this.grassTower.alpha = 0.3;
            this.groundTower.alpha = 0.3;
        } else if (this.currency.total >= 50) {
            this.groundTower.alpha = 1;
            this.magicTower.alpha = 1;
            this.waterTower.alpha = 1;
        }
        if (this.currency.total < 20) {
            this.grassTower.alpha = 0.3;
            this.groundTower.alpha = 0.3;
            this.magicTower.alpha = 0.3;
        } else if (this.currency.total >= 20) {
            this.magicTower.alpha = 1;
            this.waterTower.alpha = 1;
        }
        if (this.currency.total < 10) {
            this.grassTower.alpha = 0.3;
            this.groundTower.alpha = 0.3;
            this.magicTower.alpha = 0.3;
            this.waterTower.alpha = 0.3;
        } else if (this.currency.total >= 10) {
            this.waterTower.alpha = 1;
        }
        
        this.waterTower.tint = 0x46c4db;
        this.magicTower.tint = 0xf647b6;
        this.groundTower.tint = 0xEB6841;
        this.grassTower.tint = 0x76d646;
        
        
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
            if (this.menuItems.countLiving() > 0) {
                this.menuItems.getAt(0).kill();
            }
        }
        
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.ONE) && !this.game.input.mousePointer.isDown) {
            if (this.menuItems.countLiving() < 1 && this.currency.total >= 10) {
                this.menuItem(this.waterTower);
            }
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.TWO) && !this.game.input.mousePointer.isDown) {
            if (this.menuItems.countLiving() < 1 && this.currency.total >= 20) {
                this.menuItem(this.magicTower);
            }
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.THREE)&& !this.game.input.mousePointer.isDown) {
            if (this.menuItems.countLiving() < 1 && this.currency.total >= 50) {
                this.menuItem(this.groundTower);
            }
        }  else if (this.game.input.keyboard.isDown(Phaser.Keyboard.FOUR) && !this.game.input.mousePointer.isDown) {
            if (this.menuItems.countLiving() < 1 && this.currency.total >= 100) {
                this.menuItem(this.grassTower);
            }
        }
        
        if (this.menuItems.countLiving() > 0) {
            var item = this.menuItems.getAt(0);
            if (item.lastOverlapped && this.game.time.now > item.lastOverlapped) {
            item.overlapping = false;
            item.tint = item.originalTint;
        }
            if (this.game.input.y > 100 && this.game.input.y < 500 && this.game.input.x < 580 && this.game.input.x > 20) {
                this.game.time.events.add(200, function () {
                    this.dragging = false;
                }, this);
                item.alpha = 0.5;
                item.x = 20 * Math.round(this.game.input.x / 20);
                item.y = 20 * Math.round(this.game.input.y / 20);
                if (this.game.input.mousePointer.isDown || this.game.input.activePointer.isDown || this.game.input.onTouch) {
                    if (!item.overlapping && !this.dragging) {
                        this.tower(item);
                        item.kill();
                    }
                }
            }
        }
        
        this.game.physics.arcade.overlap(this.menuItems, this.boundaries, function (item, boundary) {
            item.tint = 0xE79797;
            item.overlapping = true;
            item.lastOverlapped = this.game.time.now + 300;
        }, null, this);
        
        this.game.physics.arcade.overlap(this.menuItems, this.towers, function (item, tower) {
            item.tint = 0xE79797;
            item.overlapping = true;
            item.lastOverlapped = this.game.time.now + 300;
        }, null, this);
        
        // WATER TOWER
        
        if (this.waterAreas.lastOverlapped && this.game.time.now > this.waterAreas.lastOverlapped) {
            this.game.physics.arcade.overlap(this.enemies, this.waterAreas, function (enemy, area) {
                if (!area.fired) {
                    this.bullet(area, enemy);
                    area.fired = true;
                    this.game.time.events.add(0, function () {
                        area.fired = false;
                    }, this);
                }
            }, null, this);
            this.waterAreas.lastOverlapped = this.game.time.now + 250;
        }
        
        // MAGIC TOWER
        
        if (this.magicAreas.lastOverlapped && this.game.time.now > this.magicAreas.lastOverlapped) {
            this.game.physics.arcade.overlap(this.enemies, this.magicAreas, function (enemy, area) {
                if (!area.fired) {
                    this.bullet(area, enemy);
                    area.fired = true;
                    this.game.time.events.add(0, function () {
                        area.fired = false;
                    }, this);
                }
            }, null, this);
            this.magicAreas.lastOverlapped = this.game.time.now + 500;
        }
        
        // GROUND TOWER
        
        if (this.groundAreas.lastOverlapped && this.game.time.now > this.groundAreas.lastOverlapped) {
            this.game.physics.arcade.overlap(this.enemies, this.groundAreas, function (enemy, area) {
                this.bullet(area, enemy);
            }, null, this);
            this.groundAreas.lastOverlapped = this.game.time.now + 750;
        }
        
        // GRASS TOWER
        
        if (this.grassAreas.lastOverlapped && this.game.time.now > this.grassAreas.lastOverlapped) {
            this.game.physics.arcade.overlap(this.enemies, this.grassAreas, function (enemy, area) {
                /*if (!area.fired) {
                    this.bullet(area, enemy);
                    area.fired = true;
                    this.game.time.events.add(0, function () {
                        area.fired = false;
                    }, this);
                }*/
                this.bullet(area, enemy);
            }, null, this);
            this.grassAreas.lastOverlapped = this.game.time.now + 300;
        }
        
        this.game.physics.arcade.overlap(this.enemies, this.maps, function (enemy, tile) {
            if (enemy.body.velocity.x !== tile.dirX*20 && enemy.body.velocity.y !== tile.dirY*20)
                enemy.body.velocity.x = tile.dirX * 100;
                enemy.body.velocity.y = tile.dirY * 100;
        } ,null,this);
    },

    quitGame: function (pointer) {
    	
        this.state.start('MainMenu');

    }

};

// Todo:
//
// - Implement dynamic variables for (scale) (tween, lifespan speed) (towerArea)
// - Experiment with tween types for different bullet effects
