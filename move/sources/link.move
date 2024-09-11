/// Module: linkforge::link
module linkforge::link {
    use std::ascii;
    use std::string;
    use std::string::utf8;
    use sui::coin::Coin;
    use linkforge::utils;
    use sui::display;
    use sui::event;
    use sui::package;
    use sui::table;

    use sui::table::Table;
    use sui::transfer::{Receiving};
    use sui::dynamic_object_field as dof;
    use sui::dynamic_field as df;
    use sui::sui::SUI;

    const ELinkIdentifyAlreadyExist: u64 = 1;
    const ELinkIdentifyAlreadyRegisted: u64 = 2;
    const ELinkSetInvalidIdentify: u64 = 3;
    const ELinkRoutingFailed: u64 = 4;
    const EOnlyAdminCanCall: u64 = 5;
    const EAmountTooLow: u64 = 6;

    public struct LINK has drop {}

    public struct Link has key {
        id: UID,
        identify: std::ascii::String,
        creator: address,
        name: std::string::String,
        // avatar url
        image_url: std::string::String,
        // base64 encoded content
        content: std::string::String,
        // content url display template name
        template: std::string::String,
    }

    public struct RouteCap has key, store {
        id: UID,
        admin: address,
        routing: Table<ascii::String, address>,
        register: Table<address, bool>
    }

    /// Receive a receiving object into the Share RouteCap.
    /// Parameters:
    /// - `w`: Mutable reference to the RouteCap.
    /// - `to_receive`: The object to receive.
    /// Returns:
    /// - The received object.
    entry fun receive<T : key+store>(cap: &mut RouteCap, to_receive: Receiving<T>, ctx: &TxContext) {
        assert!(ctx.sender() == object::uid_to_address(&cap.id), EOnlyAdminCanCall);
        let x = transfer::public_receive(&mut cap.id, to_receive);
        transfer::public_transfer(x, ctx.sender());
    }


    #[lint_allow(self_transfer)]
    fun init(witness: LINK, ctx: &mut TxContext) {
        let publisher = package::claim(witness, ctx);
        let keys = vector[
            std::string::utf8(b"identify"),
            std::string::utf8(b"name"),
            std::string::utf8(b"description"),
            std::string::utf8(b"link"),
            std::string::utf8(b"image_url"),
            std::string::utf8(b"project_url"),
            std::string::utf8(b"creator"),
        ];
        let values = vector[
            std::string::utf8(b"{identify}"),
            std::string::utf8(b"{name}"),
            std::string::utf8(
                b"A soulbound token by {creator}, marked {identify}, named {name}—an unbreakable, timeless reflection on the chain."
            ),
            std::string::utf8(
                b"https://52uzquxqktipwjlkcdmlvz249kqvpbrm9f27dcqpv81kqair46.walrus.site/#/{template}?data={content}"
            ),
            std::string::utf8(b"{image_url}"),
            std::string::utf8(b"https://52uzquxqktipwjlkcdmlvz249kqvpbrm9f27dcqpv81kqair46.walrus.site"),
            std::string::utf8(b"{creator}"),
        ];
        let mut display = display::new_with_fields<Link>(&publisher, keys, values, ctx);
        display::update_version<Link>(&mut display);

        transfer::public_transfer(publisher, ctx.sender());
        transfer::public_transfer(display, ctx.sender());
        transfer::public_share_object(RouteCap {
            id: object::new(ctx),
            admin: ctx.sender(),
            routing: table::new<ascii::String, address>(ctx),
            register: table::new<address, bool>(ctx),
        })
    }

    /// Event emitted when Link is created.
    public struct Created has copy, drop {
        creater: address,
        id: ID,
        identify: ascii::String,
    }

    /// Sets a new name for the Link.
    /// Parameters:
    /// - `s`: Mutable reference to the Link.
    /// - `name`: New name to set for the Link.
    /// Effects:
    /// - Updates the name field of the Link.
    public entry fun set_name(s: &mut Link, name: std::string::String) {
        s.name = name;
    }

    /// Retrieves the name of the Link.
    /// Parameters:
    /// - `s`: Reference to the Link.
    /// Returns:
    /// - UTF8 encoded string representing the name of the Link.
    public fun name(s: &Link): std::string::String {
        s.name
    }

    /// Sets a new image_url for the Link.
    /// Parameters:
    /// - `s`: Mutable reference to the Link.
    /// - `image_url`: New image_url to set for the Link.
    /// Effects:
    /// - Updates the image_url field of the Link.
    public entry fun set_image_url(s: &mut Link, image_url: std::string::String) {
        s.image_url = image_url;
    }

    /// Retrieves the image_url of the Link.
    /// Parameters:
    /// - `s`: Reference to the Link.
    /// Returns:
    /// - UTF8 encoded string representing the image_url of the Link.
    public fun image_url(s: &Link): std::string::String {
        s.image_url
    }

    /// Sets a new content for the Link.
    /// Parameters:
    /// - `s`: Mutable reference to the Link.
    /// - `content`: New content to set for the Link.
    /// Effects:
    /// - Updates the content field of the Link.
    public entry fun set_content(s: &mut Link, content: std::string::String) {
        s.content = content;
    }

    /// Retrieves the content of the Link.
    /// Parameters:
    /// - `s`: Reference to the Link.
    /// Returns:
    /// - UTF8 encoded string representing the content of the Link.
    public fun content(s: &Link): std::string::String {
        s.content
    }

    /// Sets a new template for the Link.
    /// Parameters:
    /// - `s`: Mutable reference to the Link.
    /// - `template`: New template to set for the Link.
    /// Effects:
    /// - Updates the template field of the Link.
    public entry fun set_template(s: &mut Link,
                                  template: std::string::String,
                                  cap: &mut RouteCap,
                                  mut c: Coin<SUI>,
                                  ctx: &mut TxContext) {
        if (c.value() > 1) {
            let fee = c.split(1, ctx);
            transfer::public_transfer(c, ctx.sender());
            transfer::public_transfer(fee, object::id_address(cap));
        }else if (c.value() == 1) {
            transfer::public_transfer(c, ctx.sender());
        }else {
            abort EAmountTooLow
        };
        s.template = template;
    }

    /// Retrieves the template of the Link.
    /// Parameters:
    /// - `s`: Reference to the Link.
    /// Returns:
    /// - UTF8 encoded string representing the template of the Link.
    public fun template(s: &Link): std::string::String {
        s.template
    }

    #[allow(lint(self_transfer))]
    /// Sets the identify of the link.
    /// Parameters:
    /// - `s`: Mutable reference to the Link.
    /// - `identify`: The new identify to set.
    public entry fun set_identify(
        s: &mut Link,
        cap: &mut RouteCap,
        link_id: ascii::String,
        mut c: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(utils::is_valid_label(&link_id), ELinkSetInvalidIdentify);
        if (c.value() > 1) {
            let fee = c.split(1, ctx);
            transfer::public_transfer(c, ctx.sender());
            transfer::public_transfer(fee, object::id_address(cap));
        }else if (c.value() == 1) {
            transfer::public_transfer(c, ctx.sender());
        }else {
            abort EAmountTooLow
        };
        let identify = utils::to_lowercase(link_id);
        assert!(!table::contains<ascii::String, address>(&cap.routing, identify), ELinkIdentifyAlreadyExist);
        table::remove(&mut cap.routing, s.identify);
        table::add(&mut cap.routing, identify, s.id.to_address());
        s.identify = identify;
    }

    /// Retrieves the identify of objects contained within the Link.
    /// Parameters:
    /// - `s`: Reference to the Link.
    /// Returns:
    /// - ASCII string indicating the identify of objects in the Link.
    public fun identify(s: &Link): std::ascii::String {
        s.identify
    }

    /// Retrieves the creator of objects contained within the Link.
    /// Parameters:
    /// - `s`: Reference to the Link.
    /// Returns:
    /// - Link SBT creator  address.
    public fun creator(s: &Link): address {
        s.creator
    }

    /// get address use identify string
    public fun router(identify: ascii::String, cap: &RouteCap): address {
        assert!(table::contains(&cap.routing, identify), ELinkRoutingFailed);
        return *table::borrow(&cap.routing, identify)
    }

    /// Creates a new Link.
    /// Parameters:
    /// - `identify`: ASCII string identifying the Link.
    /// - `name`: Name of the Link.
    /// - `image_url`: ImageUrl of the Link.
    /// - `content`: Link Content Encode as Base64 of the Link.
    /// - `cap`: RouteCap used for creating the Link.
    /// - `ctx`: Transaction context used for creating the Link.
    /// Returns:
    /// - A new Link with no items and a generic kind.
    /// Errors:
    /// - `ELinkIdentifyAlreadyExist`: If the Link identifier already exists.
    /// - `ELinkSetInvalidIdentify`: If the Link identifier is invalid.
    public entry fun new(identify: ascii::String,
                         name: string::String,
                         image_url: string::String,
                         content: string::String,
                         cap: &mut RouteCap, ctx: &mut TxContext) {
        assert!(utils::is_valid_label(&identify), ELinkSetInvalidIdentify);
        let identify = utils::to_lowercase(identify);
        assert!(!table::contains<address, bool>(&cap.register, ctx.sender()), ELinkIdentifyAlreadyRegisted);
        assert!(!table::contains<ascii::String, address>(&cap.routing, identify), ELinkIdentifyAlreadyExist);
        let id = object::new(ctx);
        let creator = ctx.sender();
        event::emit(Created {
            creater: creator,
            id: id.to_inner(),
            identify,
        });
        table::add(&mut cap.routing, identify, id.to_address());
        table::add(&mut cap.register, creator, true);
        transfer::transfer(
            Link {
                id,
                creator,
                identify,
                name,
                image_url,
                content,
                template: utf8(b"simple"),
            },
            creator
        );
    }

    /// Event emitted when Link is destroy.
    public struct Destroyed has copy, drop {
        id: ID,
        identify: std::ascii::String,
    }

    /// Destroys the Link, ensuring it is empty before deletion.
    /// Parameters:
    /// - `s`: The Link to destroy.
    /// - `cap`: RouteCap used for destroying the Link.
    /// Effects:
    /// - The Link and its identifier are deleted.
    /// Errors:
    /// - `ESpaceNotEmpty`: If the Link is not empty at the time of destruction.
    public fun destroy_empty(s: Link, cap: &mut RouteCap) {
        // delete the Space
        let Link { id, identify, creator, name: _, image_url: _, content: _, template: _ } = s;
        event::emit(Destroyed {
            id: id.to_inner(),
            identify,
        });
        table::remove(&mut cap.routing, identify);
        table::remove(&mut cap.register, creator);
        id.delete();
    }

    /// Accepts a receiving object into the link.
    /// Parameters:
    /// - `w`: Mutable reference to the Link.
    /// - `to_receive`: The object to receive.
    /// Returns:
    /// - The received object.
    public(package) fun accept<T: key+store>(s: &mut Link, to_receive: Receiving<T>): T {
        transfer::public_receive(&mut s.id, to_receive)
    }


    /// Adds an object to the link.
    /// Parameters:
    /// - `s`: Mutable reference to the Link.
    /// - `k`: The key of the object.
    /// - `v`: The value of the object.
    public(package) fun add_object<K: copy + drop + store, V: key + store>(s: &mut Link, k: K, v: V) {
        dof::add(&mut s.id, k, v);
    }

    /// Checks if an object exists in the link.
    /// Parameters:
    /// - `s`: Reference to the Link.
    /// - `k`: The key of the object.
    /// Returns:
    /// - `true` if the object exists, `false` otherwise.
    public(package) fun exists_object<K: copy + drop + store, V: key + store>(s: &Link, k: K): bool {
        dof::exists_with_type<K, V>(&s.id, k)
    }

    /// Mutates an object in the link.
    /// Parameters:
    /// - `s`: Mutable reference to the Link.
    /// - `k`: The key of the object.
    /// Returns:
    /// - Mutable reference to the object.
    public(package) fun mutate_object<K: copy + drop + store, V: key + store>(s: &mut Link, k: K): &mut V {
        dof::borrow_mut<K, V>(&mut s.id, k)
    }


    /// Borrows an object from the link.
    /// Parameters:
    /// - `s`: Reference to the Link.
    /// - `k`: The key of the object.
    /// Returns:
    /// - Reference to the object.
    public(package) fun borrow_object<K: copy + drop + store, V: key + store>(s: &Link, k: K): &V {
        dof::borrow<K, V>(&s.id, k)
    }

    /// Removes an object from the link.
    /// Parameters:
    /// - `s`: Mutable reference to the Link.
    /// - `k`: The key of the object.
    /// Returns:
    /// - The removed object.
    public(package) fun remove_object<K: copy + drop + store, V: key + store>(s: &mut Link, k: K): V {
        dof::remove<K, V>(&mut s.id, k)
    }

    /// Adds a field to the link.
    /// Parameters:
    /// - `s`: Mutable reference to the Link.
    /// - `k`: The key of the field.
    /// - `v`: The value of the field.
    public(package) fun add_field<K: copy + drop + store, V: store>(s: &mut Link, k: K, v: V) {
        df::add(&mut s.id, k, v);
    }

    /// Checks if a field exists in the link.
    /// Parameters:
    /// - `s`: Reference to the Link.
    /// - `k`: The key of the field.
    /// Returns:
    /// - `true` if the field exists, `false` otherwise.
    public(package) fun exists_field<K: copy + drop + store, V: store>(s: &Link, k: K): bool {
        df::exists_with_type<K, V>(&s.id, k)
    }

    /// Mutates a field in the link.
    /// Parameters:
    /// - `s`: Mutable reference to the Link.
    /// - `k`: The key of the field.
    /// Returns:
    /// - Mutable reference to the field.
    public(package) fun mutate_field<K: copy + drop + store, V: store>(s: &mut Link, k: K): &mut V {
        df::borrow_mut<K, V>(&mut s.id, k)
    }

    /// Borrows a field from the link.
    /// Parameters:
    /// - `s`: Reference to the Link.
    /// - `k`: The key of the field.
    /// Returns:
    /// - Reference to the field.
    public(package) fun borrow_field<K: copy + drop + store, V: store>(s: &Link, k: K): &V {
        df::borrow<K, V>(&s.id, k)
    }

    /// Removes a field from the link.
    /// Parameters:
    /// - `s`: Mutable reference to the Link.
    /// - `k`: The key of the field.
    /// Returns:
    /// - The removed field.
    public(package) fun remove_field<K: copy + drop + store, V: store>(s: &mut Link, k: K): V {
        df::remove<K, V>(&mut s.id, k)
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(LINK {}, ctx);
    }

    #[test_only]
    public fun destory_for_testing(l: Link) {
        transfer::transfer(l, @0x0);
    }
}
