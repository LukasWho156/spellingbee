import CombStatusComponent from "./comb-status-component.js";

class CombStatusSystem {

    _combs;
    _messenger;
    _statuses;

    constructor(board, messenger) {
        this._combs = board.combs;
        this._messenger = messenger;
        this._statuses = [];
        messenger.applyStatusToComb = (comb, status) => this.applyStatus(comb, status);
        messenger.countStatuses = this.countStatuses;
        messenger.getAffectedCombs = this.getAffectedCombs;
        messenger.removeStatusFromComb = (comb, status) => this.removeStatus(comb, status);
        messenger.triggerCombsBeforeAccept = (combs) => {
            combs.forEach(comb => comb.statuses.forEach(status => status.component.beforeAccept()));
        }
        messenger.triggerCombsOnAccept = (combs, multiplier) => {
            combs.forEach(comb => {
                if(comb.state !== 'accepted') return;
                comb.statuses.forEach(status => status.component.onAccept(multiplier));
            });
        }
    }

    applyStatus = (comb, status) => {
        if(!!comb.statuses.find(s => s.status === status)) return;
        const component = new CombStatusComponent(status.apply(comb, comb.sprite), this._messenger);
        component.onApply();
        this._statuses.push(component);
        comb.statuses.push({status: status, component: component})
    }

    getAffectedCombs = (status) => {
        return this._combs.filter(c => {
            return c.statuses.find(s => s.status === status);
        });
    }

    countStatuses = (status) => {
        return this.getAffectedCombs(status).length;
    }

    removeStatus = (comb, status) => {
        if(!comb) return;
        const toRemove = comb.statuses.find(s => s.status === status);
        if(!toRemove) return;
        toRemove.component.remove();
    }

    update = (delta, globalTime) => {
        if(this._messenger.isPaused()) return;
        this._combs.forEach(comb => {
            comb.statuses = comb.statuses.filter(status => !status.component.isDead);
            if(comb.state === 'rotten') {
                comb.statuses.forEach(status => status.component.onPop(this._messenger))
            }
        })
        this._statuses.forEach(status => {
            status.update(delta, globalTime, this._messenger);
        })
        this._statuses = this._statuses.filter(status => !status.isDead);
    }

}

export default CombStatusSystem