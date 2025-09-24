module agri_chain::crop_nft {
    use std::string::{Self, String};
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_token_objects::collection;
    use aptos_token_objects::token;

    // Error codes
    const ETOKEN_NOT_FOUND: u64 = 1;
    const EINSUFFICIENT_BALANCE: u64 = 2;
    const EUNAUTHORIZED: u64 = 3;
    const ETOKEN_ALREADY_LOCKED: u64 = 4;
    const ETOKEN_NOT_LOCKED: u64 = 5;
    const ELOAN_ALREADY_EXISTS: u64 = 6;
    const ELOAN_NOT_FOUND: u64 = 7;
    const EREPAYMENT_AMOUNT_INSUFFICIENT: u64 = 8;

    // Structs
    struct CropReceipt has key {
        crop_type: String,
        quantity: u64,
        quality: String,
        storage_location: String,
        warehouse_operator: String,
        moisture_content: u64, // in basis points (e.g., 1250 = 12.5%)
        timestamp: u64,
        is_locked: bool,
    }

    struct LoanRecord has key {
        receipt_token_id: address,
        principal_amount: u64,
        interest_rate: u64, // in basis points (e.g., 850 = 8.5%)
        start_timestamp: u64,
        due_timestamp: u64,
        is_active: bool,
    }

    struct CollectionData has key {
        collection_name: String,
        description: String,
        uri: String,
    }

    // Events
    #[event]
    struct ReceiptMinted has drop, store {
        token_id: address,
        farmer: address,
        crop_type: String,
        quantity: u64,
        timestamp: u64,
    }

    #[event]
    struct LoanCreated has drop, store {
        loan_id: address,
        borrower: address,
        token_id: address,
        amount: u64,
        interest_rate: u64,
        due_timestamp: u64,
    }

    #[event]
    struct LoanRepaid has drop, store {
        loan_id: address,
        borrower: address,
        token_id: address,
        amount_repaid: u64,
        timestamp: u64,
    }

    // Initialize the collection
    fun init_module(deployer: &signer) {
        let collection_name = string::utf8(b"Agri-Chain Crop Receipts");
        let description = string::utf8(b"NFT-backed e-NWR collateral for farmers");
        let uri = string::utf8(b"https://agri-chain.com/collection");
        
        collection::create_unlimited_collection(
            deployer,
            description,
            collection_name,
            option::none(),
            uri,
        );

        move_to(deployer, CollectionData {
            collection_name,
            description,
            uri,
        });
    }

    // Mint a new crop receipt NFT
    public entry fun mint_crop_receipt(
        farmer: &signer,
        crop_type: String,
        quantity: u64,
        quality: String,
        storage_location: String,
        warehouse_operator: String,
        moisture_content: u64,
        token_name: String,
        token_description: String,
        token_uri: String,
    ) acquires CollectionData {
        let farmer_addr = account::address_of(farmer);
        let collection_data = borrow_global<CollectionData>(@agri_chain);
        
        let token_constructor_ref = token::create_named_token(
            farmer,
            collection_data.collection_name,
            token_description,
            token_name,
            option::none(),
            token_uri,
        );

        let token_signer = object::generate_signer(&token_constructor_ref);
        let token_addr = object::address_from_constructor_ref(&token_constructor_ref);

        // Store crop receipt data
        move_to(&token_signer, CropReceipt {
            crop_type,
            quantity,
            quality,
            storage_location,
            warehouse_operator,
            moisture_content,
            timestamp: timestamp::now_seconds(),
            is_locked: false,
        });

        // Emit event
        event::emit(ReceiptMinted {
            token_id: token_addr,
            farmer: farmer_addr,
            crop_type,
            quantity,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Create a loan against a crop receipt NFT
    public entry fun create_loan(
        borrower: &signer,
        token_id: address,
        principal_amount: u64,
        interest_rate: u64,
        loan_duration_days: u64,
    ) acquires CropReceipt {
        let borrower_addr = account::address_of(borrower);
        
        // Verify token ownership and not locked
        assert!(object::is_owner(object::address_to_object<token::Token>(token_id), borrower_addr), EUNAUTHORIZED);
        
        let receipt = borrow_global_mut<CropReceipt>(token_id);
        assert!(!receipt.is_locked, ETOKEN_ALREADY_LOCKED);

        // Lock the token
        receipt.is_locked = true;

        // Calculate due timestamp
        let current_time = timestamp::now_seconds();
        let due_timestamp = current_time + (loan_duration_days * 24 * 60 * 60);

        // Create loan record
        let loan_signer = account::create_signer_with_capability(&account::create_test_signer_cap(borrower_addr));
        let loan_addr = account::address_of(&loan_signer);

        move_to(&loan_signer, LoanRecord {
            receipt_token_id: token_id,
            principal_amount,
            interest_rate,
            start_timestamp: current_time,
            due_timestamp,
            is_active: true,
        });

        // TODO: Transfer mock USDC to borrower
        // This would integrate with a stablecoin contract

        // Emit event
        event::emit(LoanCreated {
            loan_id: loan_addr,
            borrower: borrower_addr,
            token_id,
            amount: principal_amount,
            interest_rate,
            due_timestamp,
        });
    }

    // Repay a loan and unlock the NFT
    public entry fun repay_loan(
        borrower: &signer,
        loan_id: address,
        repayment_amount: u64,
    ) acquires LoanRecord, CropReceipt {
        let borrower_addr = account::address_of(borrower);
        
        // Get loan record
        let loan = borrow_global_mut<LoanRecord>(loan_id);
        assert!(loan.is_active, ELOAN_NOT_FOUND);

        // Calculate required repayment amount
        let current_time = timestamp::now_seconds();
        let days_elapsed = (current_time - loan.start_timestamp) / (24 * 60 * 60);
        let interest = (loan.principal_amount * loan.interest_rate * days_elapsed) / (10000 * 365);
        let total_required = loan.principal_amount + interest;

        assert!(repayment_amount >= total_required, EREPAYMENT_AMOUNT_INSUFFICIENT);

        // Mark loan as inactive
        loan.is_active = false;

        // Unlock the NFT
        let receipt = borrow_global_mut<CropReceipt>(loan.receipt_token_id);
        receipt.is_locked = false;

        // TODO: Transfer stablecoin from borrower to protocol
        // This would integrate with a stablecoin contract

        // Emit event
        event::emit(LoanRepaid {
            loan_id,
            borrower: borrower_addr,
            token_id: loan.receipt_token_id,
            amount_repaid: repayment_amount,
            timestamp: current_time,
        });
    }

    // View functions
    #[view]
    public fun get_crop_receipt(token_id: address): (String, u64, String, String, String, u64, u64, bool) acquires CropReceipt {
        let receipt = borrow_global<CropReceipt>(token_id);
        (
            receipt.crop_type,
            receipt.quantity,
            receipt.quality,
            receipt.storage_location,
            receipt.warehouse_operator,
            receipt.moisture_content,
            receipt.timestamp,
            receipt.is_locked
        )
    }

    #[view]
    public fun get_loan_details(loan_id: address): (address, u64, u64, u64, u64, bool) acquires LoanRecord {
        let loan = borrow_global<LoanRecord>(loan_id);
        (
            loan.receipt_token_id,
            loan.principal_amount,
            loan.interest_rate,
            loan.start_timestamp,
            loan.due_timestamp,
            loan.is_active
        )
    }

    #[view]
    public fun calculate_repayment_amount(loan_id: address): u64 acquires LoanRecord {
        let loan = borrow_global<LoanRecord>(loan_id);
        let current_time = timestamp::now_seconds();
        let days_elapsed = (current_time - loan.start_timestamp) / (24 * 60 * 60);
        let interest = (loan.principal_amount * loan.interest_rate * days_elapsed) / (10000 * 365);
        loan.principal_amount + interest
    }

    #[view]
    public fun is_token_locked(token_id: address): bool acquires CropReceipt {
        let receipt = borrow_global<CropReceipt>(token_id);
        receipt.is_locked
    }
}