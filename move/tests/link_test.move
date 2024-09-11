#[test_only]
module linkforge::link_test {
    use std::ascii::string;
    use std::string::utf8;
    use linkforge::test_link;
    use linkforge::link::{Self, Link};


    const UserA: address = @0xa;
    const UserB: address = @0xb;

    #[test]
    fun test_new_link() {
        let mut link_init = test_link::setup();
        link_init.next_tx_with_sender(UserA);
        assert!(link_init.sender() == UserA, 0);
        link_init.new_link(utf8(b"name1"), string(b"id1"));


        link_init.next_tx_with_sender(UserB);
        assert!(link_init.sender() == UserB, 0);
        link_init.new_link(utf8(b"name2"), string(b"id2"));
        link_init.end();
    }

    #[test]
    #[expected_failure(abort_code = link::ELinkIdentifyAlreadyExist)]
    fun test_same_id_link() {
        let mut link_init = test_link::setup();
        link_init.next_tx_with_sender(UserA);
        assert!(link_init.sender() == UserA, 0);
        link_init.new_link(utf8(b"name1"), string(b"id1"));

        link_init.next_tx_with_sender(UserB);
        assert!(link_init.sender() == UserB, 0);
        link_init.new_link(utf8(b"name2"), string(b"id1"));
        link_init.end();
    }

    #[test]
    #[expected_failure(abort_code = link::ELinkIdentifyAlreadyRegisted)]
    fun test_set_id_exist_link() {
        let mut link_init = test_link::setup();
        link_init.next_tx_with_sender(UserB);
        assert!(link_init.sender() == UserB, 0);
        link_init.new_link(utf8(b"name2"), string(b"ID-2"));

        link_init.next_tx_with_sender(UserB);
        assert!(link_init.sender() == UserB, 0);
        link_init.new_link(utf8(b"name2"), string(b"ID1"));
        link_init.end();
    }


    #[test]
    fun test_router_link() {
        let mut link_init = test_link::setup();
        link_init.next_tx_with_sender(UserA);
        assert!(link_init.sender() == UserA, 0);
        link_init.new_link(utf8(b"name1"), string(b"id1"));

        link_init.next_tx_with_sender(UserB);
        assert!(link_init.sender() == UserB, 0);
        link_init.new_link(utf8(b"name2"), string(b"id2"));


        link_init.next_tx_with_sender(UserA);
        let cap = test_link::get_cap(&mut link_init);
        let addr1 = link::router(string(b"id1"), cap);
        let obj1: Link = link_init.take_from_sender<Link>();

        assert!(addr1 == object::id(&obj1).id_to_address(), 0);
        link_init.return_to_sender(obj1);


        link_init.next_tx_with_sender(UserB);
        let cap = test_link::get_cap(&mut link_init);
        let addr2 = link::router(string(b"id2"), cap);
        let obj2: Link = link_init.take_from_sender<Link>();

        assert!(addr2 == object::id(&obj2).id_to_address(), 0);
        link::destory_for_testing(obj2);


        link_init.end();
    }
}
