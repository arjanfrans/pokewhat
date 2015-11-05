let debug = require('debug')('game:engine/utils/graham');

/**
 * Graham's Scan Convex Hull Algorithm
 * @desc An implementation of the Graham's Scan Convex Hull algorithm in Javascript.
 * @author Brian Barnett, brian@3kb.co.uk, http://brianbar.net/ || http://3kb.co.uk/
 * @version 1.0.2
 */

const ONE_RADIAN = 57.295779513082;

function ConvexHullGrahamScan () {
    this.anchorPoint = null;
    this.reverse = false;
    this.points = [];
}

ConvexHullGrahamScan.prototype = {

    constructor: ConvexHullGrahamScan,

    Point: function (x, y) {
        this.x = x;
        this.y = y;
    },

    _findPolarAngle: function (a, b) {
        let deltaX = (b.x - a.x);
        let deltaY = (b.y - a.y);

        if (deltaX === 0 && deltaY === 0) {
            return 0;
        }

        let angle = Math.atan2(deltaY, deltaX) * ONE_RADIAN;

        if (this.reverse) {
            if (angle <= 0) {
                angle += 360;
            }
        } else {
            if (angle >= 0) {
                angle += 360;
            }
        }

        return angle;
    },

    addPoint: function (x, y) {
        // Check to see if anchorPoint has been defined yet.
        if (this.anchorPoint === null) {
            // Create new anchorPoint.
            this.anchorPoint = new this.Point(x, y);

            // Sets anchorPoint if point being added is further left.
        } else if (this.anchorPoint.y > y || (this.anchorPoint.y === y &&
                    this.anchorPoint.x > x)) {
            this.anchorPoint.y = y;
            this.anchorPoint.x = x;
            this.points.unshift(new this.Point(x, y));
            return;
        }

        this.points.push(new this.Point(x, y));
    },

    _sortPoints: function () {
        let self = this;

        return this.points.sort(function (a, b) {
            let polarA = self._findPolarAngle(self.anchorPoint, a);
            let polarB = self._findPolarAngle(self.anchorPoint, b);

            if (polarA < polarB) {
                return -1;
            }
            if (polarA > polarB) {
                return 1;
            }

            return 0;
        });
    },

    _checkPoints: function (p0, p1, p2) {
        let difAngle;
        let cwAngle = this._findPolarAngle(p0, p1);
        let ccwAngle = this._findPolarAngle(p0, p2);

        if (cwAngle > ccwAngle) {
            difAngle = cwAngle - ccwAngle;

            return !(difAngle > 180);
        } else if (cwAngle < ccwAngle) {
            difAngle = ccwAngle - cwAngle;

            return (difAngle > 180);
        }

        return false;
    },

    getHull: function () {
        let hullPoints = [];
        let points;
        let pointsLength;

        this.reverse = this.points.every((point) => {
            return (point.x < 0 && point.y < 0);
        });

        points = this._sortPoints();
        pointsLength = points.length;

        // If there are less than 4 points, joining these points creates a correct hull.
        if (pointsLength < 4) {
            return points;
        }

        // Move first two points to output array
        hullPoints.push(points.shift(), points.shift());

        // Scan is repeated until no concave points are present.
        while (true) {
            let p0;
            let p1;
            let p2;

            hullPoints.push(points.shift());

            p0 = hullPoints[hullPoints.length - 3];
            p1 = hullPoints[hullPoints.length - 2];
            p2 = hullPoints[hullPoints.length - 1];

            if (this._checkPoints(p0, p1, p2)) {
                hullPoints.splice(hullPoints.length - 2, 1);
            }

            if (points.length === 0) {
                if (pointsLength === hullPoints.length) {
                    return hullPoints;
                }

                points = hullPoints;
                pointsLength = points.length;
                hullPoints = [];
                hullPoints.push(points.shift(), points.shift());
            }
        }
    }
};

module.exports = {
    calculate: function (vectors = []) {
        let ch = new ConvexHullGrahamScan();

        for (let vector of vectors) {
            ch.addPoint(vector.x, vector.y);
        }

        return ch.getHull();
    }
};
