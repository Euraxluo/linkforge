/// Module: linkforge::vault
module linkforge::vault {
    use sui::coin::Coin;
    use sui::event::emit;
    use sui::transfer::Receiving;
    use linkforge::link::{Link, exists_object, exists_field, mutate_field, borrow_field};

    // ====== Vault Error Codes =====
    const EAssetNotFoundInVault: u64 = 0;
    const ECurrencyNotFoundInVault: u64 = 1;
    const ECurrencyNotEnoughAmountInVault: u64 = 2;

    public struct CurrencyVault<phantom T> has copy, drop, store {}

    public struct AssetVault<phantom T> has copy, drop, store { id: ID }

    /// Event emitted when Receive.
    public struct ReceiveEvent has copy, drop {
        id: ID,
        identify: std::ascii::String,
    }

    /// Event emitted when Put.
    public struct PutEvent has copy, drop {
        id: ID,
        identify: std::ascii::String,
    }

    /// Event emitted when Take.
    public struct TakeEvent has copy, drop {
        id: ID,
        identify: std::ascii::String,
    }

    /// Receive an asset and stores it in the Vault.
    /// Parameters:
    /// - `s`: Mutable reference to the Space.
    /// - `assert`: The asset to be acquired and stored.
    public entry fun receive_assert<T: key + store>(s: &mut Link, assert: Receiving<T>, ctx: &mut TxContext) {
        let sent_assert = s.accept(assert);
        emit(ReceiveEvent { id: object::id(&sent_assert), identify: s.identify() });
        transfer::public_transfer(sent_assert, ctx.sender());
    }

    /// Put an asset into the Vault.
    /// Parameters:
    /// - `s`: Mutable reference to the Space.
    /// - `assert`: The asset to be stored.
    public entry fun put<T: key + store>(s: &mut Link, assert: T) {
        let assert_type = AssetVault<T> { id: object::id(&assert) };
        emit(PutEvent { id: object::id(&assert), identify: s.identify() });
        s.add_object(assert_type, assert);
    }

    /// Receipts a coin and updates the balance in the Vault.
    /// Parameters:
    /// - `s`: Mutable reference to the Space.
    /// - `currency`: The currency to be received and stored.
    public entry fun receive_coin<T>(s: &mut Link, currency: Receiving<Coin<T>>, ctx: &mut TxContext) {
        let coin = s.accept(currency);
        emit(ReceiveEvent { id: object::id(&coin), identify: s.identify() });
        transfer::public_transfer(coin, ctx.sender());
    }

    /// Deposit a coin into the Vault.
    /// Parameters:
    /// - `s`: Mutable reference to the Space.
    /// - `coin`: The coin to be deposited.
    public entry fun deposit<T>(s: &mut Link, coin: Coin<T>) {
        let balance_type = CurrencyVault<T> {};
        emit(PutEvent { id: object::id(&coin), identify: s.identify() });
        if (s.exists_field<CurrencyVault<T>, Coin<T>>(balance_type)) {
            let balance: &mut Coin<T> = s.mutate_field(balance_type);
            balance.join(coin);
        } else {
            s.add_field(balance_type, coin);
        }
    }

    /// Withdraw a specified amount of currency from the Vault and transfers it to the requester.
    /// Parameters:
    /// - `s`: Mutable reference to the Space.
    /// - `amount`: The amount of currency to be retrieved.
    /// - `ctx`: The transaction context.
    public entry fun withdraw<T>(s: &mut Link, amount: u64, ctx: &mut TxContext) {
        let balance_type = CurrencyVault<T> {};
        assert!(exists_field<CurrencyVault<T>, Coin<T>>(s, balance_type), ECurrencyNotFoundInVault);

        let balance: &mut Coin<T> = mutate_field<CurrencyVault<T>, Coin<T>>(s, balance_type);
        assert!(balance.value() >= amount, ECurrencyNotEnoughAmountInVault);

        let coin_to_retrieve = balance.split(amount, ctx);
        emit(TakeEvent { id: object::id(&coin_to_retrieve), identify: s.identify() });
        transfer::public_transfer(coin_to_retrieve, ctx.sender());
    }

    /// Take an asset from the Vault and transfers it to the requester.
    /// Parameters:
    /// - `s`: Mutable reference to the Space.
    /// - `asset_id`: The ID of the asset to be extracted.
    /// - `ctx`: The transaction context.
    public entry fun take<T: key + store>(s: &mut Link, asset_id: ID, ctx: &mut TxContext) {
        let asset_type = AssetVault<T> { id: asset_id };
        assert!(exists_object<AssetVault<T>, T>(s, asset_type), EAssetNotFoundInVault);

        let asset = s.remove_object<AssetVault<T>, T>(asset_type);
        emit(TakeEvent { id: object::id(&asset), identify: s.identify() });
        transfer::public_transfer(asset, ctx.sender());
    }


    /// Check the existence of an asset in the Vault.
    /// Parameters:
    /// - `s`: Reference to the Space.
    /// - `asset_id`: The ID of the asset to be checked.
    /// Returns:
    /// - `true` if the asset exists in the Vault, `false` otherwise.
    public fun existence<T: key + store>(s: &Link, asset_id: ID): bool {
        let asset_type = AssetVault<T> { id: asset_id };
        exists_object<AssetVault<T>, T>(s, asset_type)
    }

    /// Check the balance of the currency in the Vault.
    /// Parameters:
    /// - `s`: Reference to the Space.
    /// Returns:
    /// - The balance of the currency in the Vault.
    public fun balance<T>(s: &Link): u64 {
        let balance_type = CurrencyVault<T> {};
        if (exists_field<CurrencyVault<T>, Coin<T>>(s, balance_type)) {
            borrow_field<CurrencyVault<T>, Coin<T>>(s, balance_type).value()
        } else {
            0
        }
    }
}
