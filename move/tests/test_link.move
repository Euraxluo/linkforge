#[test_only]
module linkforge::test_link {
    use std::ascii;
    use std::string;
    use sui::object;
    use std::string::utf8;
    use linkforge::link::{RouteCap, Link, Self};
    use sui::test_scenario::{Self, Scenario};
    use sui::test_utils;

    const ENotImplemented: u64 = 0;

    const ADMIN: address = @0x12;

    public struct TestInit {
        scenario: Scenario,
        cap: RouteCap,
    }

    public fun setup(): TestInit {
        let mut scenario = test_scenario::begin(ADMIN);
        let scenario_mut = &mut scenario;

        link::init_for_testing(scenario_mut.ctx());

        scenario_mut.next_tx(ADMIN);

        let mut cap = scenario_mut.take_shared<RouteCap>();
        TestInit {
            scenario,
            cap
        }
    }

    public fun new_link(self: &mut TestInit, name: string::String, id: ascii::String) {
        link::new(id, name, utf8(b"image_url"), utf8(b"context"), &mut self.cap, self.scenario.ctx())
    }

    public fun get_mut_cap(self: &mut TestInit): &mut RouteCap {
        &mut self.cap
    }

    public fun get_cap(self: & TestInit): & RouteCap {
        &self.cap
    }

    public fun next_tx(self: &mut TestInit): &mut TestInit {
        self.scenario.next_tx(ADMIN);
        self
    }

    public fun ctx(self: &mut TestInit): &mut TxContext {
        self.scenario.ctx()
    }

    public fun ctx_ref(self: &mut TestInit): &TxContext {
        self.scenario.ctx()
    }


    public fun sender(self: &mut TestInit): address {
        self.scenario.sender()
    }

    public fun take_from_sender<T: key>(self: &mut TestInit): T {
        self.scenario.take_from_sender()
    }

    public fun return_to_sender<T: key>(self: &mut TestInit, t: T) {
        self.scenario.return_to_sender(t)
    }

    public fun take_from_sender_by_id<T: key>(self: &mut TestInit, link_id: ID): Link {
        self.scenario.take_from_sender_by_id<Link>(link_id)
    }


    public fun send_to_sender<T: key+store>(self: &mut TestInit, t: T) {
        transfer::public_transfer(t, self.scenario.sender());
    }

    public fun next_tx_with_sender(self: &mut TestInit, sender: address): &mut TestInit {
        self.scenario.next_tx(sender);
        self
    }

    public fun end(self: TestInit) {
        test_utils::destroy(self);
    }
}
